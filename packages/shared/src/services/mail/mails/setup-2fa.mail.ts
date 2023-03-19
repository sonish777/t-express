import { Service } from 'typedi';
import { Mailer } from '../mail-base.service';

@Service()
export class Setup2FAMailer extends Mailer {
    private readonly code = 'TWO_FACTOR_AUTH';
    async send(
        data: Record<string, string>,
        attachmentMetadata: {
            qrCodeFileName: string;
        }
    ) {
        (await this.parseTemplate(this.code, data))
            .to(data.to_email)
            .attachments([
                {
                    cid: 'qr_code',
                    path: data.qr_code_data,
                    filename: attachmentMetadata.qrCodeFileName,
                },
            ])
            .sendEmail();
    }
}
