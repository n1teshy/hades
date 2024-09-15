const { Field } = require("./base/field.cjs");
const { isNullish, isObject, isSyncFunction } = require("../utils/types.cjs");
const { validateMessage } = require("../utils/general.cjs");

class ObjectField extends Field {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.mapTests = [];
    this.mapViolationMsgs = [];
  }

  each(test, message = null) {
    if (!isSyncFunction(test)) {
      throw TypeError("invalid argument, expected a function");
    }
    validateMessage(message);
    this.mapTests.push(test);
    this.mapViolationMsgs.push(message);
    return this;
  }

  validate(value) {
    let message = super.checkRequired(value);
    if (message === null && !isNullish(value)) {
      if (!isObject(value)) {
        message = this.typeViolationMsg ?? `${this.name} must be an object`;
      }
      if (message === null) {
        for (let tIdx = 0; tIdx < this.mapTests.length; tIdx += 1) {
          const map = Object.entries(value).find(
            ([k, v]) => !this.mapTests[tIdx](k, v),
          );
          if (map !== undefined) {
            if (this.mapViolationMsgs[tIdx] !== null) {
              if (isSyncFunction(this.mapViolationMsgs[tIdx])) {
                message = this.mapViolationMsgs[tIdx](...map);
              } else {
                message = this.mapViolationMsgs[tIdx];
              }
            } else {
              message = `${this.name} must not contain "${map[0]}: ${map[1]}"`;
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

module.exports = { ObjectField };
