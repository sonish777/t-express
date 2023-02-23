import { MailConfig } from 'shared/configs';
import nodemailer, { Transporter } from 'nodemailer';
import config, { IConfig } from 'config';
import ejs from 'ejs';
import path from 'path';
import { Logger as WinstonLogger } from 'winston';
import { Logger } from 'shared/logger';
import Email from 'email-templates';
import { EmailTemplateService } from '../email-template.service';
import Container, { Service } from 'typedi';

const mailConfig = config.get<IConfig>('mail');

@Service()
export class Mailer {
    private _from = MailConfig.from;
    private _view = 'mail-template.ejs';
    private _to: string;
    private _template: string;
    private _subject: string;
    private _transport: Transporter;
    private logger: WinstonLogger;
    private static _instance: Mailer;

    constructor(private readonly emailTemplateService: EmailTemplateService) {
        this.logger = Logger.configure();
        this._transport = nodemailer.createTransport({
            host: MailConfig.host,
            port: MailConfig.port,
            secure: MailConfig.secure,
            auth: {
                user: MailConfig.username,
                pass: MailConfig.password,
            },
            logger: true,
            debug: process.env.NODE_ENV !== 'production',
        });
    }

    public static get instance() {
        if (!Mailer._instance) {
            Mailer._instance = Container.get(this);
        }
        return Mailer._instance;
    }

    public to(value: string) {
        this._to = value;
        return this;
    }

    public from(value: string) {
        this._from = value;
        return this;
    }

    public async parseTemplate(code: string, data: Record<string, string>) {
        const emailTemplate =
            await this.emailTemplateService.findTemplateByCode(code);
        let emailContent = emailTemplate.content;
        Object.keys(data).forEach((key) => {
            emailContent = emailContent.replace(
                new RegExp(`%${key}%`, 'g'),
                data[key]
            );
        });
        const template = await ejs.renderFile(
            path.join(__dirname, this._view),
            {
                body: emailContent,
            }
        );
        this._template = template;
        this._subject = emailTemplate.subject;
        return this;
    }

    protected sendEmail(previewOnly = process.env.NODE_ENV !== 'production') {
        if (previewOnly) {
            return new Email({ preview: true })
                .send({
                    message: {
                        from: this._from,
                        to: this._to,
                        subject: this._subject,
                        html: this._template,
                        text: this._subject,
                    },
                })
                .then(() => {
                    this.logger.info('Mail sent');
                })
                .catch((error) => {
                    this.logger.error('Mail: Error sending SMTP mail', error);
                });
        }
        return this._transport
            .sendMail({
                to: this._to,
                from: this._from,
                subject: this._subject,
                html: this._template,
                text: this._subject,
            })
            .then((result) => {
                this.logger.info('Mail sent', result);
            })
            .catch((error) => {
                this.logger.error('Mail: Error sending SMTP mail', error);
            });
    }
}
