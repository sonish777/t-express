import { Service } from 'typedi';
import { Mailer } from '../mail-base.service';

@Service()
export class ForgotPasswordMailer extends Mailer {
    async send(data: Record<string, string>) {
        (await this.parseTemplate('CMS_FORGOT_PASSWORD', data))
            .to(data.email)
            .sendEmail();
    }
}
