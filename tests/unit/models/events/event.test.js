const mongoose = require("mongoose");
const eventSchema = require("../../../../models/Event");
const eventData = {
  title: "dsfa",
  description: "dfdd",
  location: "dfsdf",
  date: new Date(),
  user_id: "1",
  created_at: new Date(),
};
const bcrypt = require("bcrypt-nodejs");

describe("Event Schema Test", () => {
  // It's just so easy to connect to the MongoDB Memory Server
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  it("create & save event successfully", async () => {
    const validEvent = new eventSchema(eventData);
    const savedEvent = await validEvent.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.title).toBe(eventData.title);
    expect(savedEvent.description).toBe(eventData.description);
    expect(savedEvent.location).toBe(eventData.location);
    expect(savedEvent.date).toBe(eventData.date);
    expect(savedEvent.user_id).toBe(eventData.user_id);
    expect(savedEvent.created_at).toBe(eventData.created_at);
  });
  // Test Schema is working!!!
  // You shouldn't be able to add in any field that isn't defined in the schema
  it("insert Event successfully, but the field is not defined in schema should be undefined", async () => {
    const EventWithInvalidField = new eventSchema({
      title: "dsfa",
      description: "dfdd",
      location: "dfsdf",
      date: new Date(),
      user_id: "1",
      created_at: new Date(),
      nickkname: "sdf",
    });
    const savedEventWithInvalidField = await EventWithInvalidField.save();
    expect(savedEventWithInvalidField._id).toBeDefined();
    expect(savedEventWithInvalidField.nickkname).toBeUndefined();
  });

  // Test Validation is working!!!
  // It should us told us the errors in on gender field.
  it("create Event without required field should failed", async () => {
    const EventWithoutRequiredField = new eventSchema({
      title: "dsfa",
    });
    let err;
    try {
      const savedEventWithoutRequiredField = await EventWithoutRequiredField.save();
      error = savedEventWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.location).toBeDefined();
  });
});
