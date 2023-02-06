import { ProviderStaticMethod } from '@core/providers';
import { UserEntity } from '@entities';
import { Express } from 'express';
import { ValidationError } from 'express-validator';
import moment from 'moment';

export class AppLocalsProvider
  implements ProviderStaticMethod<typeof AppLocalsProvider>
{
  static register(app: Express) {
    app.locals.log = (...args: any[]) => {
      console.log(...args);
    };

    app.locals.exists = (value: any): boolean => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return typeof value !== 'undefined' && value !== null;
    };

    app.locals.objectExists = (obj: Object) => {
      return Object.keys(obj).length > 0;
    };

    app.locals.get = (value: any, defaultValue = '') => {
      return app.locals.exists(value) ? value : defaultValue;
    };

    app.locals.formatDate = (value: string, format = 'YYYY/MM/DD') => {
      return moment(value, format).format(format);
    };

    app.locals.getUserInput = (
      inputData: Record<string, string>,
      key: string
    ) => {
      if (Array.isArray(inputData) && inputData.length > 0) {
        return inputData[0][key] ?? null;
      }
      return inputData && inputData[key] ? inputData[key] : null;
    };

    app.locals.getEditFormData = (
      data: Record<string, string>,
      key: string,
      inputData: Record<string, string>
    ) => {
      let value = null;
      if (inputData) {
        value = app.locals.getUserInput(inputData, key);
      }
      if (!value) {
        value = app.locals.getUserInput(data, key);
      }
      return value;
    };

    app.locals.getErrorMessage = (
      errorPayload: Record<string, ValidationError>,
      key: string
    ) => {
      if (Array.isArray(errorPayload) && errorPayload.length > 0) {
        return errorPayload[0][key]?.msg ?? null;
      }
      return errorPayload && errorPayload[key] ? errorPayload[key].msg : null;
    };

    app.locals.hasPermission = (user: UserEntity, action: string): boolean => {
      if (user.userRole?.role?.permissions) {
        return user.userRole.role.permissions.some(
          (permission) => permission.action === action
        );
      }
      return false;
    };
  }
}
