import bcrypt from 'bcrypt';

export const validatePassword = (
    suppliedPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(suppliedPassword, hashedPassword);
};
