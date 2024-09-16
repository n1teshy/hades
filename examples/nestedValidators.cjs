const { TextField, Validator } = require("../index.cjs");

/* 
  We'll create a subclass of Validator
  Field subclasses can only give you control over a single field
  if you want to validate a nested JSON block using your own logic,
  you can extend the Validator class which validates the entire block
  it's field maps to. The subclass must implement the 'validate' method
  the validate method:
  - takes the JSON block as first argument: JSON block or {} if
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
    let hasErrors = false;
    if (ration.item === undefined) {
      hasErrors = true;
      errors.item = "Ration item is required";
    } else if (itemToUnit[ration.item] === undefined) {
      hasErrors = true;
      errors.item = `Ration item must be one of ${Object.keys(itemToUnit).join(", ")}`;
    }
    if (ration.quantity === undefined) {
      hasErrors = true;
      errors.quantity = "Quantity is required";
    } else if (typeof ration.quantity !== "number") {
      hasErrors = true;
      errors.quantity = "Quantity must be a number";
    }
    if (ration.unit === undefined) {
      hasErrors = true;
      errors.unit = "Quantity Unit is required";
    } else if (ration.item && itemToUnit[ration.item] !== ration.unit) {
      hasErrors = true;
      errors.unit = `Unit must be ${itemToUnit[ration.item]} for ${ration.item}`;
    }
    return hasErrors ? errors : null;
  }
}

const rationedPersonValidator = new Validator({
  name: new TextField("Name").require(),
  ration: new RationValidator(),
});

rationedPersonValidator.validate({
  name: "Nitesh Yadav",
  ration: {
    item: "wheat",
    quantity: 1,
    unit: "kgs",
  },
});
