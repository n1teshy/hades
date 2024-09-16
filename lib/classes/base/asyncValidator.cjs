const { Validator } = require("./validator.cjs");
const {
  runAsyncTestSequence,
  setErrorObjectField,
} = require("../../utils/general.cjs");
const { propAccumulatedAsyncTests } = require("../../constants.cjs");

class AsyncValidator extends Validator {
  async validate(data) {
    let errors = super.validate(data);
    if (this[propAccumulatedAsyncTests].length === 0) {
      return Promise.resolve(errors);
    }
    const failedTestIdxs = await Promise.all(
      this[propAccumulatedAsyncTests].map(({ tests, value }) =>
        runAsyncTestSequence(value, tests),
      ),
    );
    for (let i = 0; i < this[propAccumulatedAsyncTests].length; i += 1) {
      const failedTestIdx = failedTestIdxs[i];
      if (failedTestIdx !== null) {
        if (errors === null) {
          errors = {};
        }
        let message =
          this[propAccumulatedAsyncTests][i].messages[failedTestIdx];
        if (message === null) {
          message = "invalid value";
        }
        setErrorObjectField(
          errors,
          this[propAccumulatedAsyncTests][i].path,
          message,
        );
      }
    }
    this[propAccumulatedAsyncTests] = [];
    return errors;
  }
}

module.exports = { AsyncValidator };
