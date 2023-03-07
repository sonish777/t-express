import { MultipartMetadataKeys } from 'core/utils';
import { Request, Response, NextFunction } from 'express';
import multer, { diskStorage, Field, FileFilterCallback } from 'multer';
import { Observable } from 'rxjs';
import { UnprocessableEntityException } from 'shared/exceptions';
import { v4 } from 'uuid';
import fs from 'fs';
import { validate } from 'shared/middlewares';

const multerDiskStorage = (destination: string, filename = '') =>
    diskStorage({
        destination(req, file, callback) {
            callback(null, destination);
        },
        filename(req, file, callback) {
            const extension = file.mimetype.split('/').pop();
            callback(null, filename || `${v4()}_${Date.now()}.${extension}`);
        },
    });

const fileFilter =
    (acceptableMimes: string[] = []) =>
    (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        // if (acceptableMimes.length === 0) {
        if (file.mimetype.startsWith('image')) {
            callback(null, true);
        } else {
            // Record<string, ValidationError>
            callback(
                new UnprocessableEntityException({
                    [file.fieldname]: {
                        location: 'files',
                        param: file.fieldname,
                        msg: 'Invalid file type',
                    },
                })
            );
        }
        // }
    };

export const uploader = multer({
    storage: multerDiskStorage('public/uploads'),
    fileFilter: fileFilter(),
});

export interface MultipartFields {
    [key: string]: Field[];
}

export function MulterUpload(fields: Field[]): MethodDecorator {
    return (target, prop, descriptor: PropertyDescriptor) => {
        const controllerClass = target.constructor;
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
