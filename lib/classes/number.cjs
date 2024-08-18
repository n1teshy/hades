const { MeasurableField } = require("./base/measurable.cjs");
const { isNullish, isNumber } = require("../utils/types.cjs");
const { validateMessage } = require("../utils/general.cjs");

class NumberField extends MeasurableField {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.checkWhole = false;
    this.wholeViolationMsg = null;
  }

  whole(message = null) {
    validateMessage(message);
    this.checkWhole = true;
    this.wholeViolationMsg = message;
    return this;
  }

  validate(value) {
    let message = super.checkRequired(value);
    if (message === null && !isNullish(value)) {
      if (!isNumber(value)) {
        message = this.typeViolationMsg ?? `${this.name} must be a number`;
      } else if (this.checkWhole && !Number.isInteger(value)) {
        message =
          this.wholeViolationMsg ?? `${this.name} must be a whole number`;
      } else if (this.minVal !== null && value < this.minVal) {
        message =
          this.minViolationMsg ??
          `${this.name} must be at least ${this.minVal}`;
      } else if (this.maxVal !== null && value >= this.maxVal) {
        message =
          this.maxViolationMsg ??
          `${this.name} must be smaller than ${this.maxVal}`;
      } else {
        message = this.runSyncTests(value);
      }
    }
    return message;
  }
}

module.exports = { NumberField };
