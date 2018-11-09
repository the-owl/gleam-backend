import * as moment from 'moment';
import { FixedArray, serializeDate } from '../utils';


// per-day schedule
export type DaySchedule =
  boolean | // closed/open all the day
  [moment.Duration, moment.Duration]; // open since <hh:mm> until <hh:mm>

export interface ScheduleExceptions {
  // date is DD.MM.YYYY
  [date: string]: DaySchedule;
}

// Maximum amount of days to predict opening for
const MAX_LOOKAHEAD_DAYS = 365;

export class Schedule {
  constructor (
    public week: FixedArray<DaySchedule, 7>,
    public exceptions: ScheduleExceptions = {}
  ) {}

  /**
   * Returns time when clinic will be open next time (or returns now, if it's open right now).
   * Returns null if it won't be open during next 365 days.
   * 
   * @param now Current time. Next open time will be looked up after this datetime.
   */
  getNextOpenDate (now: moment.Moment): moment.Moment | null {
    if (this.isOpen(now)) {
      return now;
    }

    const day = now.clone().add(1, 'days').startOf('day');
    for (let limiter = 0; limiter < MAX_LOOKAHEAD_DAYS; limiter++) {
      const opensAt = this.whenOpens(day);
      if (opensAt) {
        return day.add(opensAt);
      }
      day.add(1, 'days');
    }
    return null;
  }

  /**
   * Tells if a clinic is open at a given datetime.
   * @param date Compute state for this date
   */
  isOpen (date: moment.Moment): boolean {
    const schedule = this.getScheduleForDay(date);

    return this.isOpenAtDay(date, schedule);
  }

  private getScheduleForDay (date: moment.Moment): DaySchedule {
    const dateString = serializeDate(date);
    const exception = this.exceptions[dateString];

    if (exception !== undefined) {
      return exception;
    }
    return this.week[date.weekday()];
  }

  private isOpenAtDay (date: moment.Moment, schedule: DaySchedule) {
    // open all day
    if (schedule === true) {
      return true;
    }

    // closed all day
    if (schedule === false) {
      return false;
    }

    const day = date.clone().startOf('day');
    const opensAt = day.clone().add(schedule[0]);
    const closesAt = day.clone().add(schedule[1]);
    // opensAt <= date <= closesAt
    return opensAt.isBefore(date) && closesAt.isAfter(date);
  }

  // We assume that `date` is start of the day
  private whenOpens (date: moment.Moment): moment.Duration | null {
    const schedule = this.getScheduleForDay(date);
    if (schedule === false) {
      return null;
    }

    if (schedule === true) {
      // opens from beginning of the day - 00:00
      return moment.duration(0, 'minutes');
    }

    return schedule[0];
  }
}
