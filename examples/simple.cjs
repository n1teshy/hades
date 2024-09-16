const { TextField, Validator } = require("../index.cjs");

const existingUsernames = ["batman", "the_dark_knight"];

const userSchema = {
  username: new TextField("Username")
    .require()
    .min(4)
    .max(20)
    .test(
      (username) => existingUsernames.indexOf(username) === -1,
      "You ain't him bro",
    ),
  password: new TextField("Password")
    .require("Seriously? You don't want security?")
    .min(12, "This is why you keep getting hacked, write a longer one"),
};

const validator = new Validator(userSchema);
validator.validate({});
/* returns
{
  username: 'Username is required',
  password: "Seriously? You don't want security?"
}
*/

validator.validate({
  username: "measly_nerd",
  password: "measly_nerd's password",
});
// returns null
