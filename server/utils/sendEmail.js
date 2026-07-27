import nodemailer from 'nodemailer';

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // SMTP not configured — caller decides how to handle this
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return cachedTransporter;
};

/**
 * Sends an email. If SMTP isn't configured (e.g. local development), this
 * logs the email to the console instead of throwing, so auth flows keep
 * working end-to-end without a real mail provider.
 *
 * @returns {Promise<{ delivered: boolean }>}
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[sendEmail] SMTP not configured — logging email instead of sending.\n` +
        `To: ${to}\nSubject: ${subject}\n${text || html}`
    );
    return { delivered: false };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Zen-G Wear <no-reply@zen-g-wear.io>',
    to,
    subject,
    html,
    text,
  });

  return { delivered: true };
};

export default sendEmail;
