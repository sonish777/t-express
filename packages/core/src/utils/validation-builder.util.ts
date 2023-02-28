import { check, Meta, Schema, ValidationChain } from 'express-validator';
import _ from 'lodash';
import {
    CustomValidator,
    ValidationMessageOptions,
    ValidationOptions,
    ValidationMessages,
} from 'core/validators';
import moment from 'moment';

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
    private static _validators: ValidationChain;

    private constructor() {
        throw new Error('This class cannot be instantiated');
    }

    static build() {
        return this._validators;
    }

    static ForField(field: string) {
        this._field = field;
        this._validators = check(this._field);
        return this;
    }

    static Required(options: ValidationOptions = {}) {
        this._validators.notEmpty().withMessage(
            options.message ??
                getMessage(ValidationMessages.required, {
                    field: options.fieldDisplayName ?? this._field,
                })
        );
        return this;
    }

    static IsOptional() {
        this._validators.if((value: any) => value);
    }

    static IsEmail(options: ValidationOptions = {}) {
        this._validators.isEmail().withMessage(
            options.message ??
                getMessage(ValidationMessages.email, {
                    field: options.fieldDisplayName ?? this._field,
                })
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
        this._validators.custom(
            validatorInstance.validate.bind(validatorInstance)
        );
        return this;
    }

    static IsDate(options: ValidationOptions = {}) {
        this._validators
            .custom((value: string) => {
                return moment(new Date(value)).isValid();
            })
            .withMessage(
                options.message ??
                    getMessage(ValidationMessages.date, {
                        field: options.fieldDisplayName || this._field,
                    })
            );
        return this;
    }

    private static checkLength(
        minOrMax: 'min' | 'max',
        length: number,
        options: ValidationOptions = {}
    ) {
        this._validators.isLength({ [minOrMax]: length }).withMessage(
            options.message ??
                getMessage(ValidationMessages[minOrMax], {
                    field: options.fieldDisplayName ?? this._field,
                    [minOrMax]: length,
                })
        );
        return this;
    }

    static ConfirmPassword(options: ValidationOptions = {}) {
        this._validators
            .custom(
                (value: string, { req }: Meta) => value === req.body.password
            )
            .withMessage(
                options.message ??
                    getMessage(ValidationMessages.confirmPassword)
            );
        return this;
    }

    static IsEnum(
        enumType: Record<string, string>,
        options: ValidationOptions = {}
    ) {
        this._validators
            .custom(
                (value: string) =>
                    Object.values(enumType).indexOf(value.toLowerCase()) !== -1
            )
            .withMessage(
                options.message ??
                    getMessage(ValidationMessages.shouldContain, {
                        field: options.fieldDisplayName ?? this._field,
                        options: Object.values(enumType).join(','),
                    })
            );
        return this;
    }
}
