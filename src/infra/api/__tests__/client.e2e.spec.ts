import request from "supertest";
import { app, sequelize } from "../app";

describe("E2E test for client", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

    it ("should create a client", async () => {
        const response = await request(app)
        .post("/client")
        .send({
            id: "1",
            name: "Client",
            document: "doc",
            email: "client@gmail.com",
            street: "Street",
            number: "1",
            complement: "apto",
            city: "City",
            state: "State",
            zipCode: "29000000"
        });
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Client");
    expect(response.body.document).toBe("doc");
    expect(response.body.email).toBe("client@gmail.com");
    expect(response.body.address._street).toBe("Street");
    expect(response.body.address._number).toBe("1");
    expect(response.body.address._complement).toBe("apto");
    expect(response.body.address._city).toBe("City");
    expect(response.body.address._state).toBe("State");
    expect(response.body.address._zipCode).toBe("29000000");
    });
});      