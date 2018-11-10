import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Min, Max } from 'class-validator';
import { Schedule, ScheduleExceptions, DaySchedule } from './Schedule';
import * as moment from 'moment';
import { FixedArray } from '../utils';


// per-day schedule
type SerializedDaySchedule =
  boolean | // closed/open all the day
  [string, string]; // open since <hh:mm> until <hh:mm>

interface SerializedScheduleExceptions {
  // date is 'DD.MM.YYYY'
  [date: string]: SerializedDaySchedule;
}

interface SerializedSchedule {
  // exceptions that override general weekly schedule
  exceptions: SerializedScheduleExceptions;
  // week[0] - Monday, week[1] - Tuesday, etc...
  week: FixedArray<SerializedDaySchedule, 7>;
}

const decimalTransformer = {
  from: Number,
  to: String
};

const scheduleTransformer = {
  from (json: SerializedSchedule): Schedule {
    const week = json.week.map(this.parseDaySchedule) as FixedArray<DaySchedule, 7>;
    const exceptions: ScheduleExceptions = {};
    for (const date of Object.keys(json.exceptions || {})) {
      exceptions[date] = this.parseDaySchedule(json.exceptions[date]);
    }
    return new Schedule(week, exceptions);
  },
  parseDaySchedule: (schedule: SerializedDaySchedule) => {
    if (typeof schedule === 'boolean') {
      return schedule;
    }

    return schedule.map(time => moment.duration(time)) as DaySchedule;
  },
  serializeDaySchedule: (schedule: DaySchedule) => {
    if (typeof schedule === 'boolean') {
      return schedule;
    }

    return schedule.map(time => `${time.hours()}:${time.minutes()}`) as SerializedDaySchedule;
  },
  to (schedule: Schedule): SerializedSchedule {
    const week = schedule.week.map(
      this.serializeDaySchedule
    ) as FixedArray<SerializedDaySchedule, 7>;
    const exceptions: SerializedScheduleExceptions = {};
    for (const date of Object.keys(schedule.exceptions)) {
      exceptions[date] = this.serializeDaySchedule(schedule.exceptions[date]);
    }
    return { exceptions, week };
  }
};

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  name?: string;

  @Column('text')
  address?: string;

  @Column('text')
  type?: string;

  @Column('decimal', { precision: 2, scale: 1, transformer: decimalTransformer })
  @Min(1) @Max(5)
  rating?: number;

  // TODO: use proper geo type (postgis?)
  @Column('float')
  lat?: number;

  @Column('float')
  lon?: number;

  @Column('json', { transformer: scheduleTransformer })
  schedule?: Schedule;
}
