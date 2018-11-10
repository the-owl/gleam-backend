import { interfaces, controller, httpGet } from 'inversify-express-utils';
import { Repository } from 'typeorm';
import { TYPES } from '../ioc/types';
import { Clinic } from '../entity/Clinic';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import * as moment from 'moment';


@controller('/clinics')
export class ClinicsController implements interfaces.Controller {
  constructor (
    @inject(TYPES.ClinicRepository) private clinicsRepository: Repository<Clinic>
  ) {}

  @httpGet('/')
  private async getClinics (req: Request, res: Response) {
    let clientPosition: any = null;
    if (req.query.lat && req.query.lon) {
      clientPosition = [Number(req.query.lat), Number(req.query.lon)];
    }

    function getDistance (pos1: any, pos2: any) {
      return Math.sqrt(
        Math.pow(pos2[0] - pos1[0], 2) +
        Math.pow(pos2[1] - pos1[1], 2)
      ) * 100;
    }

    const clinics = await this.clinicsRepository.find();
    const now = moment();
    const clinicsJson = clinics.map(clinic => {
      const isOpen = clinic.schedule!.isOpen(now);
      return {
        address: clinic.address,
        distance: clientPosition ? getDistance(clientPosition, [clinic.lat, clinic.lon]) : null,
        id: clinic.id,
        isOpen,
        name: clinic.name,
        opensAt: isOpen ? null : clinic.schedule!.getNextOpenDate(now)!.unix(),
        position: [clinic.lat, clinic.lon],
        rating: clinic.rating,
        type: clinic.type
      };
    });
    res.json({ success: true, data: clinicsJson });
  }
}
