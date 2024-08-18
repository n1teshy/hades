const { Field } = require("./base/field.cjs");
const { isNullish } = require("../utils/general.cjs");
const { isBool } = require("../utils/types.cjs");

class BoolField extends Field {
  validate(value) {
    let message = super.checkRequired(value);
    if (message === null && !isNullish(value) && !isBool(value)) {
      message = this.typeViolationMsg ?? `${this.name} must be a boolean value`;
    }
    return message;
  }
}

module.exports = { BoolField };
