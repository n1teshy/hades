const { validateMessage } = require("../../utils/general.cjs");
const {
  isNullish,
  isSyncFunction,
  isAsyncFunction,
} = require("../../utils/types.cjs");
const { FLD_SYNC_TESTS, FLD_ASYNC_TESTS } = require("../../constants.cjs");

class Field {
  constructor(name, typeViolationMsg = null) {
    this.name = name;
    this.isRequired = false;
    this.requireViolationMsg = null;
    this.typeViolationMsg = typeViolationMsg;
    this.tests = { [FLD_SYNC_TESTS]: [], [FLD_ASYNC_TESTS]: [] };
    this.testViolationMsgs = { [FLD_SYNC_TESTS]: [], [FLD_ASYNC_TESTS]: [] };
  }

  require(message = null) {
    validateMessage(message);
    this.isRequired = true;
    this.requireViolationMsg = message;
    return this;
  }

  test(testFn, message = null) {
    if (!isSyncFunction(testFn) && !isAsyncFunction(testFn)) {
      throw new TypeError(`invalid testFn argument, expected function`);
    }
    validateMessage(message);
    const fnType = isSyncFunction(testFn) ? FLD_SYNC_TESTS : FLD_ASYNC_TESTS;
    this.tests[fnType].push(testFn);
    this.testViolationMsgs[fnType].push(message);
    return this;
  }

  checkRequired(value) {
    let message = null;
    if (this.isRequired && isNullish(value)) {
      message = this.requireViolationMsg ?? `${this.name} is required`;
    }
    return message;
  }

  runSyncTests(value) {
    const tests = this.tests[FLD_SYNC_TESTS];
    const violationMsgs = this.testViolationMsgs[FLD_SYNC_TESTS];
    let message = null;
    for (let i = 0; i < tests.length; i += 1) {
      if (!tests[i](value)) {
        if (violationMsgs[i] !== null) {
          if (isSyncFunction(violationMsgs[i])) {
            message = violationMsgs[i](value);
          } else {
            message = violationMsgs[i];
          }
        } else {
          message = "invalid value";
        }
        break;
      }
    }
    return message;
  }

  validate() {
    throw new TypeError(
      `${this.constructor.name} does not implement the 'validate' method,
      if this is a custom field class, please implement the method`,
    );
  }
}

module.exports = { Field };
