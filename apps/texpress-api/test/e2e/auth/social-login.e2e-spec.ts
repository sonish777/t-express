import request from 'supertest';
import { AppFactory } from '../../factories/app';
import {
    verifyErrorResponse,
    verifyValidationResponse,
    verifySuccessResponse,
} from '../../utils/api.response.util';
import { Constants } from '../../utils/constants';

describe('AuthController Social Login (e2e)', () => {
    jest.setTimeout(5000);
    let app: AppFactory;

    beforeAll(async () => {
        app = await AppFactory.new();
    });

    afterEach(async () => {
        if (app) await app.cleanDB();
    });

    afterAll(async () => {
        if (app) await app.close();
    });

    it('/POST auth/social-login should throw invalid token when accessToken is invalid ', async () => {
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/social-login`)
            .set('Accept', 'application/json')
            .send({
                socialType: 'google',
                accessToken: 'ya29.a0AVvZVsq61kh96J1lsadasfasdfsp_GONrCP1A',
            });
        verifyErrorResponse(response, 400, 'Invalid Token');
    });

    it('/POST auth/social-login should throw validation error when the social type is other than google, facebook or apple', async () => {
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/social-login`)
            .set('Accept', 'application/json')
            .send({
                socialType: 'googleeee',
                accessToken:
                    'ya29.a0AVvZVsq61kh96J1lsadasfasdfsp_GONrCP1AsBMR8GXE2m0ovSZecZsc-bTBe3O70aiFNh_mIPic1lL0AS99fP7v9W7xSKKpmzPmuJOcgE1uUZfKP5JS5jC1jq-FzFlugZDeMqxVvnOfJyH_pSfNRNjWDIGiqqVmhWaw4aCgYKAQMSARMSFQGbdwaIHe7aQYDGn3CDnd5tRaFJJA0163',
            });
        verifyValidationResponse(response, 422);
    });

    it('/POST auth/social-login should provide access and refresh token', async () => {
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/social-login`)
            .set('Accept', 'application/json')
            .send({
                socialType: 'google',
                accessToken:
                    'ya29.a0AVvZVsp0zx9QKz-dhP4ARtuNK9R859g4Kv9nNjMDcO9cQCyT34GPtGHWbAfbZ7cUl1vGFt_b-fHrt-S2glFeyRwp4UNdvFIa29HT__vN3F-oJrKZ6QxGvS7BAf8u3Jd1Sa1M-jLhAc_95gn0FgAHaeU7LVETaCgYKAUgSARMSFQGbdwaIB8kfmDjykYisHFIV04d8Fw0163',
            });
        verifySuccessResponse(response, 200, ['accessToken', 'refreshToken']);
    });
});
