import { interfaces, controller, httpPost, httpGet } from 'inversify-express-utils';
import { Repository } from 'typeorm';
import { TYPES } from '../ioc/types';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { Appointment } from '../entity/Appointment';
import * as bodyParser from 'body-parser';
import { Clinic } from '../entity/Clinic';


@controller('/appointments')
export class AppointmentController implements interfaces.Controller {
  constructor (
    @inject(TYPES.AppointmentRepository) private appointmentRepository: Repository<Appointment>,
    @inject(TYPES.ClinicRepository) private clinicsRepository: Repository<Clinic>
  ) {}

  @httpPost('/', bodyParser.json({ type: '*/*' }))
  private async addAppointment (req: Request, res: Response) {
    const { name, email, phone } = req.body;
    if (typeof name !== 'string' || !name.trim().length) {
      res.status(400).json({ success: false, error: 'invalid name' });
      return;
    }

    if (typeof email !== 'string' || !email.trim().length) {
      res.status(400).json({ success: false, error: 'invalid email' });
      return;
    }

    if (typeof phone !== 'string' || !phone.trim().length) {
      res.status(400).json({ success: false, error: 'invalid phone' });
      return;
    }

    const clinic = await this.clinicsRepository.findOne({ id: req.body.clinicId });

    if (!clinic) {
      res.status(404).json({ success: false, error: 'clinic not found' });
      return;
    }

    const appointment = new Appointment();
    appointment.name = name;
    appointment.email = email;
    appointment.phone = phone;
    appointment.clinic = clinic;
    appointment.date = moment();
    await this.appointmentRepository.save(appointment);

    res.status(200).json({ success: true });
  }

  @httpGet('/')
  private async getAppointments (req: Request, res: Response) {
    const page = Number(req.query.page) || 0;
    const perPage = Number(req.query.perPage) || 10;

    const [appointments, total] = await this.appointmentRepository.findAndCount({
      order: {
        id: 'DESC'
      },
      relations: ['clinic'],
      skip: page * perPage,
      take: perPage
    });

    const rows = appointments.map(appointment => ({
      clinic: {
        id: appointment.clinic!.id,
        name: appointment.clinic!.name
      },
      date: appointment.date!.unix(),
      email: appointment.email,
      id: appointment.id,
      name: appointment.name,
      phone: appointment.phone
    }));

    res.json({ success: true, data: { appointments: rows, total } });
  }
}
