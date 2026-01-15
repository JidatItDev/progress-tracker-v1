import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: SendMailParams): Promise<void> => {
  await transporter.sendMail({
    from: `"Support Team" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
