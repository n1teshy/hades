## Hades

A simple JSON validator

### Installation

Hades is available through the [npm registry](https://www.npmjs.com/).

```bash
npm install hades
```

### Basic Usage

```javascript
const { TextField, Validator } = require("hades");

const existingUsernames = ["batman", "the_dark_knight"];

const userSchema = {
  username: new TextField("Username")
    .require()
    .min(4)
    .max(20)
    .test(
      (username) => existingUsernames.indexOf(username) === -1,
      "You ain't him bro",
    ),
  password: new TextField("Password")
    .require("Seriously? You don't want security?")
    .min(12, "This is why you keep getting hacked, write a longer one"),
};

const validator = new Validator(userSchema);
console.log(validator.validate({}));
/* prints
{
  username: 'Username is required',
  password: "Seriously? You don't want security?"
}
*/

console.log(
  validator.validate({
    username: "measly_nerd",
    password: "measly_nerd's password",
  }),
);
/* prints null */

```

### How it works
You pass it a schema and it validates your JSON object based on the schema, how else do you think? there are classes for every data type you can find in a JSON document i.e. number, string, array, object and boolean, all those classes implement methods for basic tests, to declare a fields as required, to control the size of a field's value etc and there is a `test` method on every class that you can use to define your own tests, your test can be a synchronous or asynchronous function that will get the value of the field as the only argument and you can implement any test logic inside that function and return a boolean that indicates if the value passes the test, like this `(numericValue) => numericValue < 10`.

By default, a field validator is not required and only runs type test, that is, the field can either have the values `null` or `undefined` or a value of the specified type, e.g. `username: new TextField("Username")` will accept `null` or `undefined` or a `string`. To make a field required, call `require()` on it. If a field fails one of the tests, no further tests are run, asynchronous tests defined with the `test` method are only used after a field passes all synchronous tests. Something you should probably know about asynchronous tests is asynchronous tests for all fields run in parallel and serially for a single field, consider the above exmaple with the userSchema, if `username` field had 10 asynchronous tests and `password` had 5, both fields run in parallel but the 10 username tests will run serially one after the other, so you have parallelism across fields but not for tests defined on a single field, this is done on purpose so if a field fails an asycnhronous test, it doesn't run any more tests.

You can specify an optional error message to show if a test fails, they are strings for pre-defined tests like `require`, `min`, `max` and string or function for tests defined using `each` for arrays and object and the ubiquitous `test` method, in short, if you define the test using a function, the error message ca also be a function, a function that will get the failing value as the only argument and you can return the error message to show using the failed value, like this `(failedValue) => "No can do, " + String(failedValue) + " won't cut it"`

**find examples in the the `/examples` folder to see implementations and also how you can extend these classes to get your own class with your own validation logic**.

### Classes
### new Field(name: string, typeViolationMessage?: string)
- `constructor` takes the field name and the type violation message as parameters
- `name` argument is used to construct default error messages, as in `${fieldName} is required` for the `require` test.
- #### methods
- - `require(violationMessage?: string)` makes this field required, won't accept `null` or `undefined`, the optional `violationMessage` is returned in case the value is not provided or a default error message is returned.
- - `test(testFn: function, violationMessage?: function | string)` defines a custom test for this field, `testFn` can be a synchronous or asynchronous function that takes the field's value and returns a boolean indicating if the value passes the test and `violationMessage` can be a string literal or a function that accepts the failing value as argument and returns the violationMessage.
- - `validate` takes field's value and runs all validation tests, returns `null` if values passes all tests, or an error message, must be implemented by subclasses.


### new MeasurableField(name: string, typeViolationMessage?: string)
- this is more of a utility class used for types `string`, `number` and `array`, it implements, `min` and `max` methods to validate value size.
- `constructor`, as defined in the `Field` class
- #### methods
- - `require(violationMessage?: string)` as defined in the `Field` class
- - `min(minValue: number, violationMessage?: string)` sets the minimum(inclusive) value for the field, numbers are checked using the value itself like `fieldValue >= minValue`, strings and arrays are checked using their length like `stringFieldValue.length >= minValue`.
- - `max(maxValue: number, violationMessage?: string)` sets the maximum(exclusive) value for the field, numbers are checked using the value itself like `fieldValue < minValue`, strings and arrays are checked using their length like `stringFieldValue.length < minValue`.
- - `test(testFn: function, violationMessage?: function | string)` as defined in the `Field` class
- - `validate` as defined in the `Field` class

### new TextField(name: string, typeViolationMessage?: string)
- the class for validating text fields
- `constructor` as defined in the `Field` class
- #### methods
- - `require(violationMessage?: string)` as defined in the `Field` class
- - `min(minValue: number, violationMessage?: string)` as defined in the `MeasurableField` class, checks if string value has more than or equal to `minValue` characters
- - `max(maxValue: number, violationMessage?: string)` as defined in the `MeasurableField` class, checks if string value has less than `maxValue` characters
- - `expr(re: RegExp, violationMessage?: string)` sets a regular expression which the field value will be tested against
- - `test(testFn: function, violationMessage?: function | string)` as defined in the `Field` class
- - `validate` as defined in the `Field` class

### new NumberField(name: string, typeViolationMessage?: string)
- the class for validating number fields
- `constructor` as defined in the `Field` class
- #### methods
- - `require(violationMessage?: string)` as defined in the `Field` class
- - `min(minValue: number, violationMessage?: string)` as defined in the `MeasurableField` class, checks if value is greater than or equal to `minValue`
- - `max(maxValue: number, violationMessage?: string)` as defined in the `MeasurableField` class, checks if value is less than `maxValue`
- - `whole(violationMessage?: string)` will only allow whole numbers
- - `test(testFn: function, violationMessage?: function | string)` as defined in the `Field` class
- - `validate` as defined in the `Field` class


### new BoolField(name: string, typeViolationMessage?: string)
- the class for validating boolean fields
- `constructor` as defined in the `Field` class
- #### methods
- - `require(violationMessage?: string)` as defined in the `Field` class
- - `test(testFn: function, violationMessage?: function | string)` as defined in the `Field` class
- - `validate` as defined in the `Field` class

### new ArrayField(name: string, typeViolationMessage?: string)
- the class for validating array fields
- `constructor` as defined in the `Field` class
- #### methods
- - `require(violationMessage?: string)` as defined in the `Field` class
- - `min(minValue: number, violationMessage?: string)` as defined in the `MeasurableField` class, checks if array has more than or equal to `minValue` elements
- - `max(maxValue: number, violationMessage?: string)` as defined in the `MeasurableField` class, checks if string array has less than `MaxValue` elements
- - `each(testFn: function, violationMessage?: function | string)` runs `testFn` on each element of the array and if an element fails the test, it calls `violationMessage` with the failing element or returns it if it is a string.
- - `test(testFn: function, violationMessage?: function | string)` as defined in the `Field` class
- - `validate` as defined in the `Field` class

### new ArrayField(name: string, typeViolationMessage?: string)
- the class for validating array fields
- `constructor` as defined in the `Field` class
- #### methods
- - `require(violationMessage?: string)` as defined in the `Field` class
- - `each(testFn: function, violationMessage?: function | string)` runs `testFn` on each key-value pair of the object and if a pair fails the test, it calls `violationMessage` with the failing key and value or returns it if it is a string.
- - `test(testFn: function, violationMessage?: function | string)` as defined in the `Field` class
- - `validate` as defined in the `Field` class

### new Validator(schema: {[field: string]: any})
- `constructor` takes a schema, validates JSON documents based on it
- **NOTE: this class only handles synchronous tests**
- #### methods
- - `validate(data: {[key: string]: any}, path?: string)` takes a JSON document and returns `null` if all tests passed or an object of the same structure as `data` where fields will have their respective error messages, `path` is almost never going to be used, you can set a base path level for the error object returned, so the error message for a field `user.name` in `data` will be set at `${path}.user.name` in the returned error messages object.

### new AsyncValidator(schema: {[field: string]: any})
- `constructor` as defined in `Validator`
- **NOTE: this class handles both synchronous and asynchronous tests**
- #### methods
- - `validate(data: {[key: string]: any}, path?: string)` as defined in `Validator`