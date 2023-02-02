import { ErrorFormatter } from 'express-validator';

export const ArrayFormat: ErrorFormatter = ({ msg }) => {
  return `- ${msg}`;
};
