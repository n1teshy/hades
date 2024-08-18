const FLD_SYNC_TESTS = "sync";
const FLD_ASYNC_TESTS = "async-tests";

const PATH_DELIM = "<:>";

const TYPES = {
  NUMBER: typeof 1,
  STRING: typeof "a",
  ARRAY: "array",
  OBJECT: typeof {},
  DATE: "date",
  BOOL: typeof true,
};
const displayTypes = {
  NUMBER: "number",
  INTEGER: "integer",
  FLOAT: "float",
  REGEX: "regular expression",
  FUNCTION: "function",
};

module.exports = {
  FLD_SYNC_TESTS,
  FLD_ASYNC_TESTS,
  PATH_DELIM,
  TYPES,
  displayTypes,
};
