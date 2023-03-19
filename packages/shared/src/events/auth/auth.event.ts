import { BaseEvent } from 'core/events';
import { ForgotPasswordMailer, SendOTPMailer } from 'shared/services';
import { Setup2FAMailer } from 'shared/services';
import { Service } from 'typedi';
import { v4 } from 'uuid';
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

    setup2FAHandler(...payload: AuthEventsTypes['setup-2fa']) {
        this.setup2FAMailer.send(
            {
                user_name: payload[0].user_name,
                qr_code_data: payload[0].qr_code_data,
                to_email: payload[0].to_email,
            },
            {
                qrCodeFileName: `QR_SCAN_${v4()}.png`,
            }
        );
    }

    constructor(
        public readonly sendOtpMailer: SendOTPMailer,
        public readonly forgotPasswordCmsMailer: ForgotPasswordMailer,
        public readonly setup2FAMailer: Setup2FAMailer
    ) {
        super();
        this.on('send-otp', this.sendOtp.bind(this));
        this.on('cms-forgot-password', this.forgotPasswordCms.bind(this));
        this.on('setup-2fa', this.setup2FAHandler.bind(this));
    }
}
