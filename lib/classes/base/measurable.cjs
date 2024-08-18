const { Field } = require("./field.cjs");
const { isNumber } = require("../../utils/types.cjs");
const { validateMessage } = require("../../utils/general.cjs");
const { displayTypes } = require("../../constants.cjs");

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
      throw new TypeError(
        `invalid minimum value ${value}, must be a ${displayTypes.NUMBER}`,
      );
    }
    validateMessage(message);
    this.minVal = value;
    this.minViolationMsg = message;
    return this;
  }

  max(value, message = null) {
    if (!isNumber(value)) {
      throw new TypeError(
        `invalid argument ${value}, must be a ${displayTypes.NUMBER}`,
      );
    }
    validateMessage(message);
    this.maxVal = value;
    this.maxViolationMsg = message;
    return this;
  }
}

module.exports = { MeasurableField };
