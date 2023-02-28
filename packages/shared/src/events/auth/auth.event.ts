import { BaseEvent } from 'core/events';
import { ForgotPasswordMailer, SendOTPMailer } from 'shared/services';
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

    forgotPasswordCms(...payload: AuthEventsTypes['cms-forgot-password']) {
        this.forgotPasswordCmsMailer.send({
            user_name: payload[0].user_name,
            reset_password_link: payload[0].reset_password_link,
            to_email: payload[0].to_email,
        });
    }

    constructor(
        public readonly sendOtpMailer: SendOTPMailer,
        public readonly forgotPasswordCmsMailer: ForgotPasswordMailer
    ) {
        super();
        this.on('send-otp', this.sendOtp.bind(this));
        this.on('cms-forgot-password', this.forgotPasswordCms.bind(this));
    }
}
