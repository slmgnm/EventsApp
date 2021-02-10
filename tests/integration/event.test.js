const request = require("supertest");
const Event = require("../../models/Event");
const mongoose = require("mongoose");
let server;

describe("/events", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    server.close();
    await Event.remove({});
  });
  describe("GET /", () => {
    it("should return all events", async () => {
      await Event.collection.insertMany([
        { title: "event11" },
        { title: "event22" },
      ]);
      const res = await request(server).get("/events");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe();
    });
  });
  //working until here
  describe("GET /:id", () => {
    it("should return an event if valid ID is passed", async () => {
      const event = new Event({
        title: "event9",
        created_at: new Date(),
        user_id: "2",
        date: new Date(),
        location: "Helsinki",
        description: "dfgdgdfg",
      });
      await event.save();

      const res = await request(server).get("/events/" + event._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", Event.title);
    });
  });
});
