import { BaseEvent } from 'core/events';
import { SendOTPMailer } from 'shared/services';
import { Service } from 'typedi';
import { AuthEventsTypes } from './interfaces/auth-events.interface';

@Service()
export class AuthEvents extends BaseEvent<AuthEventsTypes> {
    sendOtp(...payload: AuthEventsTypes['send-otp']) {
        this.sendOtpMailer.send({
            user_name: payload[0].user_name,
            otp_code: payload[0].otp_code,
            to_email: payload[0].to_email,
        });
    }

    constructor(public readonly sendOtpMailer: SendOTPMailer) {
        super();
        this.on('send-otp', this.sendOtp.bind(this));
    }
}
