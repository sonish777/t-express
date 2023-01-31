import { Meta } from 'express-validator';

export type CustomValidator = {
  validate(value: any, meta: Meta): any;
};
