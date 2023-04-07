import { Service } from 'typedi';
import { Mailer } from '../mail-base.service';

@Service()
export class SendOTPMailer extends Mailer {
    private readonly code = 'SEND_OTP';
    async send(data: Record<string, string>) {
        (await this.parseTemplate(this.code, data))
            .to(data.to_email)
            .sendEmail();
    }
}
