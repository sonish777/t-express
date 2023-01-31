import { check, checkSchema, Schema, ValidationChain } from 'express-validator';
import _ from 'lodash';
import {
  CustomValidator,
  ValidationMessageOptions,
  ValidationOptions,
} from '@core/validators';
import { ValidationMessages } from '@core/validators/constants';

export const getMessage = (
  message: string,
  options: ValidationMessageOptions = {}
) => {
  const replaceKeys = message.match(/%(.*?)?%/g) || [];
  for (const key of replaceKeys) {
    const replacer = _.get(options, _.trim(key, '%'));
    message = message.replace(key, replacer);
  }
  return message;
};

export class ValidationBuilder {
  private static _field: string;
  private static _validators: ValidationChain[];

  private constructor() {}

  static build() {
    return this._validators;
  }

  static ForField(field: string) {
    this._field = field;
    this._validators = [];
    return this;
  }

  static Required(options: ValidationOptions = {}) {
    this._validators.push(
      check(this._field)
        .exists()
        .withMessage(
          options.message ??
            getMessage(ValidationMessages.required, {
              field: options.fieldDisplayName ?? this._field,
            })
        )
    );
    return this;
  }

  static IsEmail(options: ValidationOptions = {}) {
    this._validators.push(
      check(this._field)
        .isEmail()
        .withMessage(
          options.message ??
            getMessage(ValidationMessages.email, {
              field: options.fieldDisplayName ?? this._field,
            })
        )
    );
    return this;
  }

  static MinCharacters(length: number, options: ValidationOptions = {}) {
    this.checkLength('min', length, options);
    return this;
  }

  static MaxCharacters(length: number, options: ValidationOptions = {}) {
    this.checkLength('max', length, options);
    return this;
  }

  static Custom(validator: new (...args: any[]) => CustomValidator) {
    const validatorInstance = new validator();
    this._validators.push(
      check(this._field).custom(
        validatorInstance.validate.bind(validatorInstance)
      )
    );
    return this;
  }

  static IsDate(options: ValidationOptions = {}) {
    this._validators.push(
      check(this._field)
        .isDate()
        .withMessage(
          options.message ??
            getMessage(ValidationMessages.date, {
              field: options.fieldDisplayName || this._field,
            })
        )
    );
    return this;
  }

  static CheckSchema(schema: Schema) {
    this._validators.push(...checkSchema(schema));
    return this;
  }

  private static checkLength(
    minOrMax: 'min' | 'max',
    length: number,
    options: ValidationOptions = {}
  ) {
    this._validators.push(
      check(this._field)
        .isLength({ [minOrMax]: length })
        .withMessage(
          options.message ??
            getMessage(ValidationMessages[minOrMax], {
              field: options.fieldDisplayName ?? this._field,
              min: length,
            })
        )
    );
    return this;
  }
}
