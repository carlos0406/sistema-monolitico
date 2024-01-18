import express, { Request, Response } from 'express';
import { AddClientFacadeInputDto } from '../../../modules/client-adm/facade/client-adm.facade.interface';
import ClientAdmFacade from '../../../modules/client-adm/facade/client-adm.facade';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';
import Address from '../../../modules/@shared/domain/value-object/address';

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    const clientFacade = ClientAdmFacadeFactory.create();

    try {

        const clientDto:AddClientFacadeInputDto = {
            id: req.body.id,
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            address: new Address(req.body.street,
              req.body.number,
              req.body.complement,
              req.body.city,
              req.body.state,
              req.body.zipCode)
      };
      await clientFacade.add(clientDto);

      const output = await clientFacade.find({ id: clientDto.id });
      res.send(output);
    }catch (err:any) {
      res.status(400).send(err.message);
    }
});