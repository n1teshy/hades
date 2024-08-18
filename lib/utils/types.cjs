const { TYPES } = require("../constants.cjs");

function isNullish(value) {
  return value === undefined || value === null;
}

function isString(value) {
  return typeof value === TYPES.STRING;
}

function isNumber(value) {
  return typeof value === TYPES.NUMBER;
}

function isArray(value) {
  return Array.isArray(value);
}

function isObject(value) {
  return !isNullish(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function isDate(value) {
  return (
    (isString(value) || isNumber(value)) &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function isBool(value) {
  return typeof value === TYPES.BOOL;
}

function isSyncFunction(value) {
  return value.constructor.name === "Function";
}

function isAsyncFunction(value) {
  return value.constructor.name === "AsyncFunction";
}

module.exports = {
  isNullish,
  isString,
  isNumber,
  isArray,
  isObject,
  isDate,
  isBool,
  isSyncFunction,
  isAsyncFunction,
};
