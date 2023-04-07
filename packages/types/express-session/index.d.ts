import { SessionData } from 'express-session';

declare module 'express-session' {
    interface SessionData extends SessionData {
        twoFAVerified?: boolean;
    }
}
