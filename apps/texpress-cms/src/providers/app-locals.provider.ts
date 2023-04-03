import { Express } from 'express';
import { ValidationError } from 'express-validator';
import moment from 'moment';
import _ from 'lodash';
import { ProviderStaticMethod } from 'core/providers';
import { UserEntity } from 'shared/entities';
import Container from 'typedi';
import { CMSConfigService } from '@cms/services';

export class AppLocalsProvider
    implements ProviderStaticMethod<typeof AppLocalsProvider>
{
    private static cmsConfigService = Container.get(CMSConfigService);

    static register(app: Express) {
        app.use(async (req, res, next) => {
            const cmsConfigMap: Record<string, string> = {};
            const cmsConfigs =
                await AppLocalsProvider.cmsConfigService.findAll();
            cmsConfigs.forEach((config) => {
                cmsConfigMap[config.name] = config.value;
            });
            res.locals.cmsConfig = cmsConfigMap;
            next();
        });

        app.locals.log = (...args: any[]) => {
            // eslint-disable-next-line no-console
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
            if (inputData && Array.isArray(inputData) && inputData.length > 0) {
                return app.locals.getUserInput(inputData, key);
            }
            return app.locals.getUserInput(data, key);
        };

        app.locals.getErrorMessage = (
            errorPayload: Record<string, ValidationError>,
            key: string
        ) => {
            if (Array.isArray(errorPayload) && errorPayload.length > 0) {
                return errorPayload[0][key]?.msg ?? null;
            }
            return errorPayload && errorPayload[key]
                ? errorPayload[key].msg
                : null;
        };

        app.locals.hasPermission = (
            user: UserEntity,
            action: string
        ): boolean => {
            if (action === 'dashboard:view') {
                return true;
            }
            if (user.role?.[0]?.permissions) {
                return user.role[0].permissions.some(
                    (permission) => permission.action === action
                );
            }
            return false;
        };

        app.locals.capitalize = _.capitalize;
    }
}
