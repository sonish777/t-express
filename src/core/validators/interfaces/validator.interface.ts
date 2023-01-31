import { ValidationChain } from 'express-validator';

export type Validator = {
  new (...args: any[]): any;
  get rules(): Record<string, ValidationChain[]>;
};

export type ValidatorWithStaticProps<I extends Validator> = InstanceType<I>;
