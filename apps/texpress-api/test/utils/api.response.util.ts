import { Response } from 'supertest';
import { MetaConstant } from 'shared/constants';

export const verifyResponse = (
    res: Response,
    statusCode: number,
    type: string
) => {
    expect(res.statusCode).toEqual(statusCode);
    const keys = Object.keys(res.body);
    const values: Record<string, any>[] = Object.values(res.body);
    expect(keys).toEqual(expect.arrayContaining(['meta', type]));
    expect(values[0]).toEqual(expect.objectContaining(MetaConstant.meta));
    return values;
};

export const verifyErrorResponse = (
    res: Response,
    statusCode: number,
    message?: string
) => {
    const values = verifyResponse(res, statusCode, 'error');
    if (message) {
        expect(values[1]['message']).toEqual(expect.stringContaining(message));
    }
};

export const verifyValidationResponse = (
    res: Response,
    statusCode: number,
    detailMessage?: string
) => {
    const values = verifyResponse(res, statusCode, 'error');
    const errorKeys = Object.keys(values[1]);
    expect(errorKeys).toEqual(
        expect.arrayContaining(['name', 'message', 'statusCode', 'detail'])
    );
    if (detailMessage) {
        const detailIndex = errorKeys.indexOf('detail');
        const errorValues = Object.values(values[1]);
        const detailValue: Record<string, any>[] = errorValues[detailIndex];
        expect(detailValue[0]['errors'][0]).toEqual(
            expect.stringContaining(detailMessage)
        );
    }
};

export const verifySuccessResponse = (
    res: any,
    statusCode: number,
    keys?: Array<string>
) => {
    const values = verifyResponse(res, statusCode, 'data');
    const successKeys = Object.keys(values[1]);
    if (keys) {
        expect(successKeys).toEqual(expect.arrayContaining(keys));
    }
};
