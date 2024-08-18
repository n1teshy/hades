const { MeasurableField } = require("./base/measurable.cjs");
const {
  isArray,
  isNullish,
  isSyncFunction,
  isAsyncFunction,
} = require("../utils/types.cjs");
const { validateMessage } = require("../utils/general.cjs");
const { displayTypes } = require("../constants.cjs");

class ArrayField extends MeasurableField {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.elemTests = [];
    this.elemViolationMsgs = [];
  }

  each(testFn, message = null) {
    if (!isSyncFunction(testFn) && !isAsyncFunction(testFn)) {
      throw new TypeError(
        `invalid argument, expected a ${displayTypes.FUNCTION}`,
      );
    }
    validateMessage(message);
    this.elemTests.push(testFn);
    this.elemViolationMsgs.push(message);
    return this;
  }

  validate(value) {
    let message = super.checkRequired(value);
    if (message === null && !isNullish(value)) {
      if (!isArray(value)) {
        message = this.typeViolationMsg ?? `${this.name} must be a list`;
      } else if (this.minVal !== null && value.length < this.minVal) {
        message =
          this.minViolationMsg ??
          `${this.name} must have at least ${this.minVal} input(s)`;
      } else if (this.maxVal !== null && value.length >= this.maxVal) {
        message =
          this.maxViolationMsg ??
          `${this.name} must have less than ${this.maxVal} elements`;
      } else {
        for (let tIdx = 0; tIdx < this.elemTests.length; tIdx += 1) {
          for (let eIdx = 0; eIdx < value.length; eIdx += 1) {
            if (!this.elemTests[tIdx](value[eIdx])) {
              message =
                this.elemViolationMsgs[tIdx] ??
                `${this.name} must not contain ${value[eIdx]}`;
              break;
            }
          }
        }
      }
      if (message === null) {
        message = this.runSyncTests(value);
      }
    }
    return message;
  }
}

module.exports = { ArrayField };
