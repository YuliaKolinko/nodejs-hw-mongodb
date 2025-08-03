import nodemailer from 'nodemailer';
import { SMTP } from '../constants/contacts.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';

const transporter = nodemailer.createTransport({
  host: getEnvVariable(SMTP.SMTP_HOST),
  port: Number(getEnvVariable(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVariable(SMTP.SMTP_USER),
    pass: getEnvVariable(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
