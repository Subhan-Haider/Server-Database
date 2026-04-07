"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    async sendEmail(to, subject, templateName, context) {
        try {
            const templatePath = path_1.default.resolve(__dirname, `../templates/${templateName}.hbs`);
            if (!fs_1.default.existsSync(templatePath))
                throw new Error('Email template not found');
            const source = fs_1.default.readFileSync(templatePath, 'utf8');
            const template = handlebars_1.default.compile(source);
            const html = template(context);
            await this.transporter.sendMail({
                from: `"AetherBase" <${process.env.SMTP_FROM || 'no-reply@aetherbase.app'}>`,
                to,
                subject,
                html
            });
            return true;
        }
        catch (err) {
            console.error('Email sending failed:', err);
            return false;
        }
    }
}
exports.EmailService = EmailService;
