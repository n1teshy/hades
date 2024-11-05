const { TextField, Validator } = require("../index.cjs");

// this file implements the simplest possible user-data validation

// suppose these are usernames that have already bee taken
const existingUsernames = ["batman", "the_dark_knight"];

// define fields to check in data
const userSchema = {
  username: new TextField("Username")
    .require()
    .min(4)
    .max(20)
    .test(
      // check if the usernmae has been taken
      (username) => existingUsernames.indexOf(username) === -1,
      // send a message indicating to user that the username has
      // been taken already
      "You ain't him bro",
    ),
  password: new TextField("Password")
    .require("Seriously? You don't want security?")
    .min(12, "This is why you keep getting hacked, write a longer one"),
};

const validator = new Validator(userSchema);
// eslint-disable-next-line no-console
console.log(validator.validate({}));
/* prints
{
  username: 'Username is required',
  password: "Seriously? You don't want security?"
}
*/

// eslint-disable-next-line no-console
console.log(
  validator.validate({
    username: "measly_nerd",
    password: "measly_nerd's password",
  }),
);
// prints null
