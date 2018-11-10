import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import * as moment from 'moment';
import { Clinic } from './Clinic';


const momentTransformer = {
  from (date: Date) {
    return moment(date);
  },
  to (m: moment.Moment) {
    return m.toDate();
  }
};

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  name?: string;

  @Column('text')
  phone?: string;

  @Column('text')
  email?: string;

  @Column('timestamp', { transformer: momentTransformer })
  date?: moment.Moment;

  @ManyToOne(() => Clinic)
  clinic?: Clinic;
}
