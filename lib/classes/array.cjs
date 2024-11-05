const { MeasurableField } = require("./base/measurable.cjs");
const { isArray, isNullish, isSyncFunction } = require("../utils/types.cjs");
const { validateMessage } = require("../utils/general.cjs");

class ArrayField extends MeasurableField {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.elemTests = [];
    this.elemViolationMsgs = [];
  }

  each(testFn, message = null) {
    if (!isSyncFunction(testFn)) {
      throw new TypeError(
        `invalid testFn argument, expected synchronous function`,
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
          const elem = value.find((e) => !this.elemTests[tIdx](e));
          if (elem !== undefined) {
            if (this.elemViolationMsgs[tIdx] !== null) {
              if (isSyncFunction(this.elemViolationMsgs[tIdx])) {
                message = this.elemViolationMsgs[tIdx](elem);
              } else {
                message = this.elemViolationMsgs[tIdx];
              }
            } else {
              message = `${this.name} must not contain ${elem}`;
            }
            break;
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
