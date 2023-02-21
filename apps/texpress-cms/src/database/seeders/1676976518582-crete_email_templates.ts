import { EmailTemplateEntity } from 'shared/entities';
import { MigrationInterface, QueryRunner, Repository } from 'typeorm';

export class creteEmailTemplates1676976518582 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const emailTemplatesRepository: Repository<EmailTemplateEntity> =
            queryRunner.manager.getRepository(EmailTemplateEntity);
        const emailTemplates: Partial<EmailTemplateEntity>[] = [
            {
                code: 'SEND_OTP',
                subject: 'OTP Code',
                content: `
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tr>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi %user_name%,</p>
                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                        Your one time password for setting your new password is %otp_code%.
                    </p>
                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Thank you!</p>
                    </td>
                </tr>
                </table>
                </td>`,
            },
        ];
        await emailTemplatesRepository.query(
            `TRUNCATE TABLE public."email_templates" RESTART IDENTITY`
        );
        await emailTemplatesRepository.save(emailTemplates);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const emailTemplatesRepository: Repository<EmailTemplateEntity> =
            queryRunner.manager.getRepository(EmailTemplateEntity);
        await emailTemplatesRepository.query(
            `TRUNCATE TABLE public."email_templates" RESTART IDENTITY`
        );
    }
}
