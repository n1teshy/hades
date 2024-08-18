const { validateMessage } = require("../../utils/general.cjs");
const { isNullish, isSyncFunction } = require("../../utils/types.cjs");
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
    if (!(testFn instanceof Function)) {
      throw new TypeError(`invalid test function, got ${typeof testFn}`);
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
        message = violationMsgs[i] ?? "invalid value";
        break;
      }
    }
    return message;
  }
}

module.exports = { Field };
