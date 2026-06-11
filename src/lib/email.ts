import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER || 'dev@kiler-app.local';
const emailPassword = process.env.EMAIL_PASSWORD || 'dev-password';
const emailHost = process.env.EMAIL_HOST || 'smtp.mailtrap.io';
const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 2525;
const emailFrom = process.env.EMAIL_FROM || 'noreply@kiler-app.com';

// Create transporter
let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
  // Use SendGrid in production
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
} else {
  // Use Mailtrap or configured SMTP in development
  transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: 'Verify your Kiler account',
    html: `
      <h1>Welcome to Kiler!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Verify Email
      </a>
      <p>Or copy and paste this link:</p>
      <p>${verificationLink}</p>
      <p>This link will expire in 7 days.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: 'Reset your Kiler password',
    html: `
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
      <p>Or copy and paste this link:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
  const name = firstName ? ` ${firstName}` : '';

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: 'Welcome to Kiler!',
    html: `
      <h1>Welcome to Kiler,${name}!</h1>
      <p>Your account has been successfully created. You're all set to start your journey towards better financial awareness, zero-waste living, and personalized health tracking.</p>
      <p>Get started by completing your health profile to receive personalized recommendations.</p>
      <a href="${process.env.NEXT_PUBLIC_API_URL}/dashboard" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Go to Dashboard
      </a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}
