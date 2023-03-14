import request from 'supertest';
import { AppFactory } from '../../factories/app';
import {
    verifyValidationResponse,
    verifySuccessResponse,
    verifyErrorResponse,
} from '../../utils/api.response.util';
import { Constants } from '../../utils/constants';
import { CreateUserDto } from '@api/dtos';

describe('AuthController (e2e)', () => {
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

    it('/POST auth/register should send otp to email when the credentials are correct.', async () => {
        await registerUser();
    });

    async function registerUser(
        validationMessage?: string
    ): Promise<request.Response> {
        const userRegisterPayload: CreateUserDto = {
            firstName: 'Binita',
            lastName: 'Shrestha',
            email: 'binita670@email.com',
            mobileNumber: '9803550600',
            dob: '1990-02-17',
            gender: 'female',
        };
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/register`)
            .set('Accept', 'application/json')
            .send(userRegisterPayload);
        validationMessage
            ? verifyValidationResponse(response, 422, validationMessage)
            : verifySuccessResponse(response, 201);
        return response;
    }

    it('/POST auth/register should send validation error when validation are not met.', async () => {
        const userRegisterPayload = {
            firstName: 'Bi',
            lastName:
                'ShresthaShresthaShresthaShresthaShresthaShresthaShresthaShrestha',
            email: 'binita670',
            mobileNumber: '980355060000',
            gender: 'female',
        };
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/register`)
            .set('Accept', 'application/json')
            .send(userRegisterPayload);
        verifyValidationResponse(response, 422);
    });

    it('/POST auth/register should check unique email while user tries to register with same email', async () => {
        // register user
        await registerUser();

        // check if the user with the same email tries to register.
        await registerUser('email already taken');
    });

    it('/POST auth/verify-otp should send invalid otp when user tries to verify invalid otp', async () => {
        // register user
        await registerUser();

        const payload = {
            username: 'binita670@email.com',
            otpCode: '000001',
        };
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/verify-otp`)
            .set('Accept', 'application/json')
            .send(payload);
        verifyErrorResponse(response, 400, 'Invalid OTP code');
    });

    it('/POST auth/verify-otp should verify the otp token if the user tries to verify valid otp', async () => {
        // register user
        await registerUser();
        const payload = {
            username: 'binita670@email.com',
            otpCode: '000000',
        };
        const response = await request(app.appInstance)
            .post(`${Constants.apiPrefix}/auth/verify-otp`)
            .set('Accept', 'application/json')
            .send(payload);
        expect(response.statusCode).toEqual(200);
    });
});
