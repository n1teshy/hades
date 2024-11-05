const { Field, TextField, Validator } = require("../index.cjs");

// This file implements a custom Field, if you find the available Fields
// do not fulfil your requirements, you can subclass the 'Field' and write
// your own Field validation

/* 
  DateField:
   - will check if the given value is a valid date

  to create a Field subclass, you must implement the 'validate' method
  the validate method is used by the Validator object to validate the field value
  in a JSON block.
  
  the validate method:
  - takes the JSON field's value as the only argument
  - return null if all tests passed or an error message

  NOTE: if you define a utility method on your custom Field i.e. min() in DateField
  you must return the DateField instance from the method, this is to ensure that
  method chaining works for the instance.
*/

class DateField extends Field {
  constructor() {
    super();
    this.minVal = null;
    this.minViolationMsg = null;
  }

  min(minVal, minViolationMsg = null) {
    this.minVal = new Date(minVal);
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
        if (timestamp.getTime() < this.minVal.getTime()) {
          message = `must be after ${this.minVal.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}`;
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

// this will validate a message sent from one user to another
const messageValidator = new Validator({
  message: new TextField("Message").require(),
  from: new Validator(userSchema),
  to: new Validator(userSchema),
  at: new DateField("Time").require().min(new Date("1 Aug 2003").getTime()),
});

// eslint-disable-next-line no-console
console.log(
  messageValidator.validate({
    message: "Hello stranger on the internet",
    from: { username: "user1", fullName: "User one" },
    to: { username: "user2", fullName: "User two" },
    at: "1 Jan 2001",
  }),
  /* prints
    { at: 'must be after 01-Aug-2003' }
  */
);
