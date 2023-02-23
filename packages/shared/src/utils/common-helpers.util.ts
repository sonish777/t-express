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
