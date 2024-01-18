import { Sequelize } from "sequelize-typescript";
import request from 'supertest';
import { InvoiceModel } from '../../../modules/invoice/repository/invoice.model';
import { ItemModel } from '../../../modules/invoice/repository/item.model';
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facede.factory";
import { app } from "../app";

describe('E2E test for invoice', () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
	  sequelize = new Sequelize({
		dialect: "sqlite",
		storage: ":memory:",
		logging: false,
		sync: { force: true },
	  });
  
	  sequelize.addModels([InvoiceModel, ItemModel]);
	  await sequelize.sync();
    });

	afterEach(async () => {
	  await sequelize.close();
	});

	it('should find a invoice', async () => {
		const input = {
			name: "Invoice name",
			document: "1234",
			street: "street",
			number: "5678",
			complement: "apto",
			city: "city",
			state: "state",
			zipCode: "29000000",
			items: [
			  {
				id: "1",
				name: "item 1",
				price: 10,
			  },
			  {
				id: "2",
				name: "item 2",
				price: 20,
			  },
			],
		  };
	  
		const facade = InvoiceFacadeFactory.create();
		const output = await facade.create(input);

		const response = await request(app)
			.get(`/invoice/${output.id}`)
			.send();

		expect(response.status).toBe(200);
		expect(response.body.id).toBeDefined();
		expect(response.body.name).toBe('Invoice name');
		expect(response.body.document).toBe('1234');
		expect(response.body.address.street).toBe("street");
		expect(response.body.address.number).toBe("5678");
		expect(response.body.address.complement).toBe("apto");
		expect(response.body.address.city).toBe("city");
		expect(response.body.address.state).toBe("state");
		expect(response.body.address.zipCode).toBe("29000000");
		expect(response.body.items[0].id).toBeDefined();
		expect(response.body.items[0].name).toBe("item 1");
		expect(response.body.items[0].price).toBe(10);
		expect(response.body.items[1].id).toBeDefined();
		expect(response.body.items[1].name).toBe("item 2");
		expect(response.body.items[1].price).toBe(20);
		expect(response.body.total).toBe(30);
	});
});