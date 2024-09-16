type validationMessageFn<T> = (value: T) => string;
type measurable = string | any[] | number;
type validationErrors = { [key: string]: string | validationErrors };

export class Field {
  constructor(name: string, typeViolationMsg?: string);
  require(message?: string): this;
  test(
    testFn: (value: any) => boolean,
    message?: validationMessageFn<any> | string
  ): this;
}

export class MeasurableField extends Field {
  min(value: number, message?: string): this;
  max(value: number, message?: string): this;
}

export class TextField extends MeasurableField {
  expr(re: RegExp, message?: string): this;
  validate(value: any): string | null;
}

export class NumberField extends MeasurableField {
  whole(message?: string): this;
  validate(value: any): string | null;
}

export class BoolField extends Field {
  validate(value: any): string | null;
}

export class ArrayField extends MeasurableField {
  each(
    testFn: (value: any[]) => boolean,
    message?: validationMessageFn<any> | string
  ): this;
  validate(value: any): string | null;
}

export class ObjectField extends MeasurableField {
  each(
    testFn: (key: string, value: any) => boolean,
    message?: (key: string, value: any) => string | string
  ): this;
  validate(value: any): string | null;
}

export class Validator {
  validate(data: any, path?: string): null | validationErrors;
}

export class AsyncValidator extends Validator {}
