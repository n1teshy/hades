const { Field } = require("./base/field.cjs");
const { isNullish, isObject } = require("../utils/types.cjs");
const { validateMessage } = require("../utils/general.cjs");
const { displayTypes } = require("../constants.cjs");

class ObjectField extends Field {
  constructor(name, typeViolationMsg = null) {
    super(name, typeViolationMsg);
    this.keyRe = null;
    this.reViolationMsg = null;
    this.valueTest = null;
    this.valueTestMsg = null;
    this.mapTest = null;
    this.mapViolationMsg = null;
  }

  keyExpr(re, message = null) {
    if (!(re instanceof RegExp)) {
      throw new TypeError(`invalid argument, must be a ${displayTypes.REGEX}`);
    }
    validateMessage(message);
    this.keyRe = re;
    this.reViolationMsg = message;
    return this;
  }

  values(test, message = null) {
    validateMessage(message);
    if (test instanceof Function) {
      this.valueTest = test;
    } else if (test === Number || test === String || test === Boolean) {
      this.valueTest = (value) => value instanceof test;
    } else {
      throw TypeError(
        `invalid argument, must be a function or one of Number, String, Boolean`,
      );
    }
    this.valueTestMsg = message;
    return this;
  }

  each(test, message = null) {
    if (!(test instanceof Function)) {
      throw TypeError("invalid argument, expected a function");
    }
    validateMessage(message);
    this.mapTest = test;
    this.mapViolationMsg = message;
    return this;
  }

  validate(value) {
    // TODO: should objects check the number of keys?
    let message = super.checkRequired(value);
    if (message === null && !isNullish(value)) {
      if (!isObject(value)) {
        message = this.typeViolationMsg ?? `${this.name} must be an object`;
      }
      const entries = Object.entries(value);
      if (message === null && this.keyRe !== null) {
        const key = entries.find(([k]) => !this.keyRe.test(k));
        if (key !== null) {
          message =
            this.reViolationMsg ?? `${this.name} must not contain field ${key}`;
        }
      }
      if (message === null && this.valueTest !== null) {
        const key = entries.find(([k]) => !this.keyRe.test(value[k]));
        if (key !== null) {
          message =
            this.valueTestMsg ??
            `${this.name} must not conatin value ${value[key]}`;
        }
      }
      if (message === null && this.mapTest !== null) {
        const map = entries.find(([k, v]) => !this.mapTest(k, v));
        if (map !== undefined) {
          message =
            this.mapViolationMsg ??
            `${this.name} must not contain "${map[0]}: ${map[1]}"`;
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
