"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if invalid input", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: "invalid-id",
        name: 1000,
        zip: "34892578927308470",
        shippingDiscount: 100
      });

      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message)
        .toContain("instance.productId is not of a type(s) number");
      expect(resp.body.error.message)
        .toContain("instance.name is not of a type(s) string");
      expect(resp.body.error.message)
        .toContain("instance.zip does not meet maximum length of 10");
      expect(resp.body.error.message)
        .toContain(`instance is not allowed to have the additional property \"shippingDiscount\"`);
      expect(resp.body.error.message)
        .toContain(`instance requires property \"addr\"`);
  })
});
