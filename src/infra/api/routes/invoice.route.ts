import express, { Request, Response } from 'express';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facede.factory';

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  try {
        const invoiceFacade = InvoiceFacadeFactory.create();

        const invoiceDto = {
            id: req.params.id
        };
        const output = await invoiceFacade.find(invoiceDto.id);

        res.send(output);
    }catch (err:any) {
        res.status(400).send(err.message);
    }
});