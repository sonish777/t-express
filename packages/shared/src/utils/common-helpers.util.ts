import crypto from 'crypto';

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
