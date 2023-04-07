import { MultipartMetadataKeys } from 'core/utils';
import { Request, Response, NextFunction } from 'express';
import multer, {
    diskStorage,
    Field,
    FileFilterCallback,
    Options,
} from 'multer';
import { Observable } from 'rxjs';
import { UnprocessableEntityException } from 'shared/exceptions';
import { v4 } from 'uuid';
import fs from 'fs';
import { validate } from 'shared/middlewares';

export const multerDiskStorage = (destination: string, filename = '') => {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }
    return diskStorage({
        destination(_req, _file, callback) {
            callback(null, destination);
        },
        filename(_req, file, callback) {
            const extension = file.mimetype.split('/').pop();
            callback(null, filename || `${v4()}_${Date.now()}.${extension}`);
        },
    });
};

export const multerFileFilter =
    (acceptableMimes: string[] = []) =>
    (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        if (acceptableMimes.length === 0) {
            if (file.mimetype.startsWith('image')) {
                callback(null, true);
            } else {
                callback(
                    new UnprocessableEntityException({
                        [file.fieldname]: {
                            location: 'files',
                            param: file.fieldname,
                            msg: 'Invalid file type provided',
                        },
                    })
                );
            }
        } else {
            if (acceptableMimes.indexOf(file.mimetype) >= 0) {
                callback(null, true);
            } else {
                callback(
                    new UnprocessableEntityException({
                        [file.fieldname]: {
                            location: 'files',
                            param: file.fieldname,
                            msg: 'Invalid file type provided',
                        },
                    })
                );
            }
        }
    };

export const uploader = (multerOptions: Options) => multer(multerOptions);

export interface MultipartFields {
    [key: string]: Field[];
}

export interface MultipartConfigs {
    [key: string]: Options;
}

export function MulterUpload(
    fields: Field[],
    multerOptions: Options
): MethodDecorator {
    return (target, prop, descriptor: PropertyDescriptor) => {
        const controllerClass = target.constructor;
        /* Register multipart fields name */
        const multipartFieldsMap: MultipartFields =
            Reflect.getMetadata(
                MultipartMetadataKeys.MULTIPART_FIELDS,
                controllerClass
            ) || {};
        multipartFieldsMap[String(prop)] = fields;
        Reflect.defineMetadata(
            MultipartMetadataKeys.MULTIPART_FIELDS,
            multipartFieldsMap,
            controllerClass
        );
        /* Register multipart configuration */
        const multipartConfigsMap: MultipartConfigs =
            Reflect.getMetadata(
                MultipartMetadataKeys.MULTIPART_CONFIGS,
                controllerClass
            ) || {};
        multipartConfigsMap[String(prop)] = multerOptions;
        Reflect.defineMetadata(
            MultipartMetadataKeys.MULTIPART_CONFIGS,
            multipartConfigsMap,
            controllerClass
        );

        const originalHandler = descriptor.value;
        descriptor.value = function (
            req: Request,
            res: Response,
            next: NextFunction
        ) {
            const observer = new Observable((subscriber) => {
                try {
                    validate(req, res);
                    const result = (<Function>originalHandler).apply(this, [
                        req,
                        res,
                        next,
                    ]);
                    if (result instanceof Promise) {
                        result.catch((error) => {
                            subscriber.error(error);
                        });
                    }
                } catch (error) {
                    subscriber.error(error);
                }
            });
            observer.subscribe({
                error: (error) => {
                    if (req.files) {
                        Object.values(req.files).forEach(
                            (files: Express.Multer.File[]) => {
                                files.forEach((file) => {
                                    if (fs.existsSync(file.path)) {
                                        fs.unlinkSync(file.path);
                                    }
                                });
                            }
                        );
                    }
                    next(error);
                },
            });
            return observer;
        };
        return descriptor;
    };
}
