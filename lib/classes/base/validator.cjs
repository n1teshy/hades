const { isObject } = require("../../utils/types.cjs");
const {
  FLD_ASYNC_TESTS,
  PATH_DELIM,
  propAccumulatedAsyncTests,
} = require("../../constants.cjs");

class Validator {
  constructor(schema) {
    this.schema = schema;
    this[propAccumulatedAsyncTests] = [];
  }

  #validate(object, schema, path) {
    let errors = null;
    const fields = Object.keys(schema);
    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i];
      const fldPath = path === null ? field : path + PATH_DELIM + field;
      let message = null;
      if (isObject(schema[field])) {
        message = this.#validate(
          isObject(object[field]) ? object[field] : {},
          schema[field],
          fldPath,
        );
      } else {
        const isDataValidator =
          schema[field][propAccumulatedAsyncTests] !== undefined;
        if (isDataValidator) {
          message = schema[field].validate(
            isObject(object[field]) ? object[field] : {},
            fldPath,
          );
        } else {
          message = schema[field].validate(object[field]);
        }
        if (isDataValidator || message === null) {
          this.addAsyncTests(fldPath, schema[field], object[field]);
        }
      }
      if (message !== null) {
        if (errors === null) {
          errors = {};
        }
        errors[field] = message;
      }
    }
    return errors;
  }

  addAsyncTests(path, fldValidator, value) {
    if (fldValidator[propAccumulatedAsyncTests] !== undefined) {
      this[propAccumulatedAsyncTests].push(
        ...fldValidator[propAccumulatedAsyncTests],
      );
      // eslint-disable-next-line no-param-reassign
      fldValidator[propAccumulatedAsyncTests] = [];
    } else if (fldValidator.tests[FLD_ASYNC_TESTS].length > 0) {
      this[propAccumulatedAsyncTests].push({
        path,
        value,
        tests: fldValidator.tests[FLD_ASYNC_TESTS],
        messages: fldValidator.testViolationMsgs[FLD_ASYNC_TESTS],
      });
    }
  }

  validate(data, path = null) {
    return this.#validate(data, this.schema, path);
  }
}

module.exports = { Validator };
