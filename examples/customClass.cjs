const { Field, TextField, Validator } = require("../index.cjs");

/* 
  We'll create a subclass of the Field class
  to creat a Field subclass, you must implement the 'validate' method
  the validate method is used by the Validator object to validate the field value
  
  the validate method:
  - takes the field's value as the only argument
  - return null if all tests passed or an error message
*/

class DateField extends Field {
  constructor() {
    super();
    this.minVal = null;
    this.minViolationMsg = null;
  }

  min(minVal, minViolationMsg = null) {
    this.minVal = minVal;
    this.minViolationMsg = minViolationMsg;
    // NOTE: you must return the instance in every method that defines a test
    return this;
  }

  validate(value) {
    /*
      checkRequired returns
      - error message if the field is required but value is null or undefined
      - else null
    */
    let message = super.checkRequired(value);
    if (message === null) {
      const type = typeof value;
      const timestamp = new Date(value);
      if (type !== "string" && type !== "number") {
        message = "must be a timestamp";
      } else if (Number.isNaN(timestamp.getTime())) {
        message = "Invalid timestamp";
      }
      if (message === null && this.minVal !== null) {
        if (timestamp.getTime() < this.minVal) {
          message = `must be after ${timestamp.toLocaleDateString()}`;
        }
      }
    }
    return message;
  }
}

const userSchema = {
  username: new TextField("Username").require(),
  fullName: new TextField("Full name").require(),
};

const validator = new Validator({
  from: new Validator(userSchema),
  to: new Validator(userSchema),
  at: new DateField("Time").require().min(new Date("18 Sept 2018").getTime()),
});

validator.validate({
  from: { username: "user1", fullName: "User one" },
  to: { username: "user2", fullName: "User two" },
  at: "18 Sept 2017",
});
