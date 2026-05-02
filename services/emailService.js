const nodemailer = require('nodemailer');

// ─── Create transporter ───────────────────────────────────────────────────
// TODO: Update EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS in your .env file
// Supported services: 'gmail', 'yahoo', 'outlook', 'hotmail', or use SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ─── Send notification to admin ──────────────────────────────────────────
const sendAdminNotification = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Golden River Website" <${process.env.EMAIL_USER}>`,
    // TODO: Update EMAIL_RECEIVER in .env with your admin email
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: `New Contact Form: ${subject || 'General Enquiry'}`,

    // 🔥 IMPORTANT FIX (reply goes to user)
    replyTo: email,

    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1813; color: #f8f4e8; padding: 40px; border: 1px solid #d4a017;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #d4a01740; padding-bottom: 20px;">
          <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.2em; color: #d4a017; text-transform: uppercase; margin: 0;">
            Golden River
          </h1>
          <p style="font-size: 10px; letter-spacing: 0.4em; color: #f8f4e840; text-transform: uppercase; margin-top: 4px;">
            New Contact Form Submission
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #d4a017; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 1px solid #25221840; width: 30%;">Name</td>
            <td style="padding: 12px 0; color: #f8f4e8; font-size: 14px; border-bottom: 1px solid #25221840;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #d4a017; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 1px solid #25221840;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #25221840;">
              <a href="mailto:${email}" style="color: #d4a017; font-size: 14px; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #d4a017; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 1px solid #25221840;">Subject</td>
            <td style="padding: 12px 0; color: #f8f4e8; font-size: 14px; border-bottom: 1px solid #25221840;">${subject || 'General Enquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #d4a017; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #f8f4e8b0; font-size: 14px; line-height: 1.7;">${message}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; text-align: center; color: #f8f4e840; font-size: 11px; letter-spacing: 0.1em;">
          © ${new Date().getFullYear()} Golden River Perfume · Received via contact form
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ─── Send auto-reply to customer ─────────────────────────────────────────
const sendAutoReply = async ({ name, email }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Golden River Perfume" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting Golden River Perfume',

    // 🔥 OPTIONAL (but good practice)
    replyTo: process.env.EMAIL_USER,

    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1813; color: #f8f4e8; padding: 40px; border: 1px solid #d4a017;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.2em; color: #d4a017; text-transform: uppercase; margin: 0;">
            Golden River
          </h1>
          <p style="font-size: 10px; letter-spacing: 0.4em; color: #f8f4e840; text-transform: uppercase;">Perfume</p>
        </div>

        <p style="font-size: 16px; font-weight: 300; color: #f0e9cc; margin-bottom: 16px;">Dear ${name},</p>
        <p style="color: #f8f4e8b0; line-height: 1.8; margin-bottom: 16px;">
          Thank you for reaching out to us. We have received your message and our team will get back to you within <strong style="color: #d4a017;">24 business hours</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/products" 
             style="background: #d4a017; color: #0f0e0b; padding: 12px 32px; text-decoration: none;">
            Shop Collection
          </a>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendAdminNotification, sendAutoReply };