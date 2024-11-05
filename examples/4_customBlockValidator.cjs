const { TextField, Validator } = require("../index.cjs");

// This file implements a Validator subclass

/* 
  A Field instance only gives you control over a field's value
  {"name": "some name"}, "name" is a field

  if you want to validate an entire block in the document, you can
  subclass the Validator ad it'll give you the entire block in the
  'validate()' method

  {"user": {"name": "some name", "id": 1}, "pfp": "https://.../1.png"}
  '{"name": "some name", "id": 1}' is a block

  the validate method:
  - takes a JSON block as first argument: JSON block or {} if
    the block doesn't exist in the data
  - a path to the block as second argument: string

  - return null if all tests passed or a structural copy of the JSON block
    where each field is set to its respective error message
*/

const itemToUnit = {
  wheat: "kgs",
  rice: "kgs",
  vegetables: "kgs",
  water: "litres",
};

class RationValidator extends Validator {
  // eslint-disable-next-line class-methods-use-this
  validate(ration) {
    const errors = {};
    if (ration.item === undefined) {
      errors.item = "Ration item is required";
    } else if (itemToUnit[ration.item] === undefined) {
      errors.item = `Ration item must be one of ${Object.keys(itemToUnit).join(", ")}`;
    }
    if (ration.quantity === undefined) {
      errors.quantity = "Quantity is required";
    } else if (typeof ration.quantity !== "number") {
      errors.quantity = "Quantity must be a number";
    }
    if (ration.unit === undefined) {
      errors.unit = "Quantity Unit is required";
    } else if (
      ration.item &&
      itemToUnit[ration.item] !== undefined &&
      itemToUnit[ration.item] !== ration.unit
    ) {
      errors.unit = `Unit must be ${itemToUnit[ration.item]} for ${ration.item}`;
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

const rationedPersonValidator = new Validator({
  name: new TextField("Name").require(),
  ration: new RationValidator(),
});

// eslint-disable-next-line no-console
console.log(
  rationedPersonValidator.validate({
    name: "Nitesh Yadav",
    ration: {
      item: "butter chicken",
      quantity: 1,
      unit: "kgs",
    },
  }),
);
/* prints
  {
    ration: { item: 'Ration item must be one of wheat, rice, vegetables, water' }
  }
*/
