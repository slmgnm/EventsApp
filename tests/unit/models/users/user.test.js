const mongoose = require("mongoose");
const userSchema = require("../../../../models/User");
const userData = { email: "dsfa", password: "dfdd", avatar: "dfsdf" };
const bcrypt = require("bcrypt-nodejs");

describe("User Schema Test", () => {
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

  it("create & save user successfully", async () => {
    const validUser = new userSchema(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.avatar).toBe(userData.avatar);
  });
  // Test Schema is working!!!
  // You shouldn't be able to add in any field that isn't defined in the schema
  it("insert user successfully, but the field does not defined in schema should be undefined", async () => {
    const userWithInvalidField = new userSchema({
      email: "dsfa",
      password: "dfdd",
      avatar: "Handsome ",
    });
    const savedUserWithInvalidField = await userWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.nickkname).toBeUndefined();
  });

  // Test Validation is working!!!
  // It should us told us the errors in on gender field.
  it("create user without required field should failed", async () => {
    const userWithoutRequiredField = new userSchema({ email: "dsfa" });
    let err;
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.avatar).toBeDefined();
  });
});
