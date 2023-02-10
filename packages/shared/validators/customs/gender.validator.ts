import { CustomValidator } from 'core/validators';

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class GenderValidator implements CustomValidator {
  validate(value: Gender) {
    if (!(Object.values(Gender).indexOf(value) >= 0)) {
      throw `Gender should be ${Object.values(Gender).join(', or ')}`;
    }
    return true;
  }
}
