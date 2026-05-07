'use strict';
const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, CLIENT_URL } = require('../config/env');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const send = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
};

const sendVerificationEmail = (to, token) =>
  send({
    to,
    subject: 'Verify your Midnight AI account',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px;background:#10131a;color:#e1e2ec;border-radius:16px">
        <h2 style="color:#adc6ff;margin-bottom:8px">Verify your email</h2>
        <p>Click the button below to verify your Midnight AI account.</p>
        <a href="${CLIENT_URL}/verify-email?token=${token}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#adc6ff,#d0bcff);color:#002e6a;font-weight:700;border-radius:10px;text-decoration:none">
          Verify Email
        </a>
        <p style="margin-top:24px;font-size:12px;color:#8b949e">Link expires in 24 hours.</p>
      </div>`,
  });

const sendPasswordResetEmail = (to, token) =>
  send({
    to,
    subject: 'Reset your Midnight AI password',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px;background:#10131a;color:#e1e2ec;border-radius:16px">
        <h2 style="color:#adc6ff;margin-bottom:8px">Reset your password</h2>
        <p>Click the button below to set a new password.</p>
        <a href="${CLIENT_URL}/reset-password?token=${token}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#adc6ff,#d0bcff);color:#002e6a;font-weight:700;border-radius:10px;text-decoration:none">
          Reset Password
        </a>
        <p style="margin-top:24px;font-size:12px;color:#8b949e">Link expires in 1 hour.</p>
      </div>`,
  });

module.exports = { send, sendVerificationEmail, sendPasswordResetEmail };
