import { Meta } from 'express-validator';

export interface CustomValidator {
    validate(value: any, meta: Meta): any;
}
