import crypto from 'crypto';
import { Express } from 'express';

export const generateOTP = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(3, (err, buffer) => {
            if (err) return reject(err);
            const otp = parseInt(buffer.toString('hex'), 16)
                .toString()
                .substring(0, 6);
            return resolve(otp);
        });
    });
};

export const generateToken = (size = 64) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
};

export const dateDiffInMinutes = (
    firstDate: Date,
    secondDate: Date
): number => {
    const diff = firstDate.getTime() - secondDate.getTime();
    return diff / (60 * 1000);
};

export const isJSON = (jsonString: string): boolean => {
    try {
        return JSON.parse(jsonString) && !!jsonString;
    } catch (error) {
        return false;
    }
};

export const extractMulterFileNames = <Entity>(
    fileColumns: (keyof Entity)[] = [],
    files: Record<string, Express.Multer.File[]> | Express.Multer.File[]
): Partial<Entity> => {
    const uploadRecord: Partial<Entity> = {};
    if (!Array.isArray(files)) {
        Object.keys(files).forEach((key) => {
            if (fileColumns.indexOf(<keyof Entity>key) >= 0) {
                const column = <keyof Entity>key;
                uploadRecord[column] = <any>files[key][0].filename;
            }
        });
    } else {
        files.forEach((file) => {
            if (fileColumns.indexOf(<keyof Entity>file.fieldname) >= 0) {
                const column = <keyof Entity>file.fieldname;
                uploadRecord[column] = <any>file.filename;
            }
        });
    }
    return uploadRecord;
};
