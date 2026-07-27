const wrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #2563eb;">Zen-G Wear</h2>
    <h3>${title}</h3>
    ${bodyHtml}
    <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`;

export const verificationEmailTemplate = (name, verifyUrl) =>
  wrapper(
    'Verify your email address',
    `<p>Hi ${name},</p>
     <p>Thanks for signing up for Zen-G Wear. Please confirm your email address:</p>
     <p><a href="${verifyUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Verify Email</a></p>
     <p>Or copy this link: ${verifyUrl}</p>
     <p>This link expires in 24 hours.</p>`
  );

export const passwordResetEmailTemplate = (name, resetUrl) =>
  wrapper(
    'Reset your password',
    `<p>Hi ${name},</p>
     <p>We received a request to reset your Zen-G Wear password:</p>
     <p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
     <p>Or copy this link: ${resetUrl}</p>
     <p>This link expires in 15 minutes.</p>`
  );
