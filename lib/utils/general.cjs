const { isString } = require("./types.cjs");
const { PATH_DELIM } = require("../constants.cjs");

function validateMessage(message) {
  if (message === null || (isString(message) && message.length > 0)) {
    return;
  }
  throw new TypeError(`invalid message "${message}"`);
}

/* eslint-disable no-param-reassign */
function setErrorObjectField(object, path, value) {
  const fields = path.split(PATH_DELIM);
  for (let i = 0; i < fields.length; i += 1) {
    const field = fields[i];
    if (i === fields.length - 1) {
      object[field] = value;
    } else {
      if (object[field] === undefined) {
        object[field] = {};
      }
      object = object[field];
    }
  }
}

async function runAsyncTestSequence(value, tests, tIdx = 0) {
  if (tIdx === tests.length) {
    return null;
  }
  const passes = await tests[tIdx](value);
  if (!passes) {
    return tIdx;
  }
  return runAsyncTestSequence(value, tests, tIdx + 1);
}

module.exports = {
  validateMessage,
  setErrorObjectField,
  runAsyncTestSequence,
};
