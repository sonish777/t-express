import request from 'supertest';
import { AppFactory } from '../../factories/app';

describe('App e2e', () => {
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

    it('/ (GET)', () => {
        return request(app.appInstance).get('/').expect(400);
    });
});
