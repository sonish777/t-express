import { ValidationChain } from 'express-validator';
import { Validator } from '../interfaces';

export const customize = (validator: Validator) => {
    const newRules: Record<string, ValidationChain> = {
        ...validator.rules,
    };
    return {
        removeRules(keys: (keyof Validator['rules'])[]) {
            keys.forEach((key) => {
                delete newRules[key];
            });
        },
        makeOptional(keys: (keyof Validator['rules'])[]) {
            Object.keys(keys).forEach((key) => {
                if (newRules[key]) {
                    newRules[key].builder.setOptional({
                        nullable: true,
                        checkFalsy: true,
                    });
                }
            });
        },
        replace(key: keyof Validator['rules'], rules: ValidationChain) {
            newRules[key] = rules;
        },
        done() {
            return class {
                static get rules() {
                    return newRules;
                }
            };
        },
    };
};
