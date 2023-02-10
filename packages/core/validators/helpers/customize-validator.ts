import { ValidationChain } from 'express-validator';
import { Validator } from '../interfaces';

export const customize = (validator: Validator) => {
    const newRules: Record<string, ValidationChain[]> = {};
    return {
        removeRules(keys: (keyof Validator['rules'])[]) {
            Object.keys(validator.rules).forEach((key) => {
                if (keys.indexOf(key) === -1) {
                    newRules[key] = validator.rules[key];
                }
            });
        },
        // makeOptional(keys: (keyof Validator['rules'])[]) {
        //   Object.keys(validator.rules).forEach((key) => {
        //     if (keys.indexOf(key) !== -1) {
        //       newRules[key] = [
        //         check(key).if((value: string) => value),
        //         ...validator.rules[key],
        //       ];
        //     }
        //   });
        // },
        done() {
            return class {
                static get rules() {
                    return newRules;
                }
            };
        },
    };
};
