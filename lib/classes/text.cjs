const { MeasurableField } = require("./base/measurable.cjs");
const { isNullish, isString } = require("../utils/types.cjs");
const { validateMessage } = require("../utils/general.cjs");
const { displayTypes } = require("../constants.cjs");

class TextField extends MeasurableField {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.re = null;
    this.exprViolationMsg = null;
  }

  expr(re, message = null) {
    if (!(re instanceof RegExp)) {
      throw new TypeError(`invalid argument, expected a ${displayTypes.REGEX}`);
    }
    validateMessage(message);
    this.re = re;
    this.exprViolationMsg = message;
    return this;
  }

  validate(value) {
    let message = super.checkRequired(value);
    if (message === null && !isNullish(value)) {
      if (!isString(value)) {
        message = this.typeViolationMsg ?? `${this.name} must be text`;
      } else if (this.minVal !== null && value.length < this.minVal) {
        message =
          this.minViolationMsg ??
          `${this.name} must have at least ${this.minVal} character(s)`;
      } else if (this.maxVal !== null && value.length >= this.maxVal) {
        message =
          this.maxViolationMsg ??
          `${this.name} must have less than ${this.maxVal} characters`;
      } else if (this.re !== null && !this.re.test(value)) {
        message = this.exprViolationMsg ?? "invalid value";
      } else {
        message = this.runSyncTests(value);
      }
    }
    return message;
  }
}

module.exports = { TextField };
