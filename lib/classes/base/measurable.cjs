const { Field } = require("./field.cjs");
const { isNumber } = require("../../utils/types.cjs");
const { validateMessage } = require("../../utils/general.cjs");

class MeasurableField extends Field {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.minVal = null;
    this.minViolationMsg = null;
    this.maxVal = null;
    this.maxViolationMsg = null;
  }

  min(value, message = null) {
    if (!isNumber(value)) {
      throw new TypeError(`invalid minimum value ${value}, expected number`);
    }
    validateMessage(message);
    this.minVal = value;
    this.minViolationMsg = message;
    return this;
  }

  max(value, message = null) {
    if (!isNumber(value)) {
      throw new TypeError(`invalid argument ${value}, expected number`);
    }
    validateMessage(message);
    this.maxVal = value;
    this.maxViolationMsg = message;
    return this;
  }
}

module.exports = { MeasurableField };
