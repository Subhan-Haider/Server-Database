import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(to: string, subject: string, templateName: string, context: any) {
        try {
            const templatePath = path.resolve(__dirname, `../templates/${templateName}.hbs`);
            if (!fs.existsSync(templatePath)) throw new Error('Email template not found');
            
            const source = fs.readFileSync(templatePath, 'utf8');
            const template = handlebars.compile(source);
            const html = template(context);

            await this.transporter.sendMail({
                from: `"AetherBase" <${process.env.SMTP_FROM || 'no-reply@aetherbase.app'}>`,
                to,
                subject,
                html
            });
            return true;
        } catch (err) {
            console.error('Email sending failed:', err);
            return false;
        }
    }
}
