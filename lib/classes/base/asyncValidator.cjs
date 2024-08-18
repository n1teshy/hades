const { Validator } = require("./validator.cjs");
const {
  runAsyncTestSequence,
  setErrorObjectField,
} = require("../../utils/general.cjs");

class AsyncValidator extends Validator {
  async validate(data) {
    let errors = super.validate(data);
    if (this.accAsyncTests.length === 0) {
      return Promise.resolve(errors);
    }
    const failedTestIdxs = await Promise.all(
      this.accAsyncTests.map(({ tests, value }) =>
        runAsyncTestSequence(value, tests),
      ),
    );
    for (let i = 0; i < this.accAsyncTests.length; i += 1) {
      const failedTestIdx = failedTestIdxs[i];
      if (failedTestIdx !== null) {
        if (errors === null) {
          errors = {};
        }
        let message = this.accAsyncTests[i].messages[failedTestIdx];
        if (message === null) {
          message = "invalid value";
        }
        setErrorObjectField(errors, this.accAsyncTests[i].path, message);
      }
    }
    this.accAsyncTests = [];
    return errors;
  }
}

module.exports = { AsyncValidator };
