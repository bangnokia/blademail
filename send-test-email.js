import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 1025,
  secure: false,
});

const emails = [
  {
    from: '"Alice Johnson" <alice@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email #1 - Welcome!',
    text: 'This is a plain text version of the email.',
    html: `
      <h1>Hello from Blade Mail!</h1>
      <p>This is the <strong>first test email</strong> to verify your SMTP server is working.</p>
      <ul>
        <li>Item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ul>
      <p>Best regards,<br>Alice</p>
    `,
  },
  {
    from: '"Bob Smith" <bob@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email #2 - Order Confirmation',
    text: 'Your order has been confirmed.',
    html: `
      <h2>Order Confirmation</h2>
      <p>Thank you for your purchase!</p>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>Product</th>
          <th>Price</th>
        </tr>
        <tr>
          <td>Product A</td>
          <td>$29.99</td>
        </tr>
        <tr>
          <td>Product B</td>
          <td>$49.99</td>
        </tr>
      </table>
      <p>Total: $79.98</p>
    `,
  },
  {
    from: '"Carol White" <carol@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email #3 - Newsletter',
    text: 'Weekly newsletter content.',
    html: `
      <h1>Weekly Newsletter</h1>
      <p>Here are the top stories this week:</p>
      <ol>
        <li>New feature announcement</li>
        <li>Upcoming events</li>
        <li>Community spotlight</li>
      </ol>
      <p><a href="https://example.com/unsubscribe">Unsubscribe</a></p>
    `,
  },
  {
    from: '"David Brown" <david@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email #4 - Password Reset',
    text: 'Reset your password using this link.',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi there,</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <p><a href="https://example.com/reset?token=abc123">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  },
  {
    from: '"Eva Martinez" <eva@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email #5 - Invitation',
    text: 'You are invited to our event.',
    html: `
      <h1>You're Invited!</h1>
      <p>Join us for an amazing event on <strong>December 31, 2025</strong>.</p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
        <h3>Event Details</h3>
        <p><strong>When:</strong> 7:00 PM</p>
        <p><strong>Where:</strong> Main Hall</p>
        <p><strong>RSVP:</strong> By December 28</p>
      </div>
      <p>We hope to see you there!</p>
    `,
  },
  {
    from: '"Frank Wilson" <frank@example.com>',
    to: 'recipient@example.com',
    cc: 'cc@example.com',
    subject: 'Test Email #6 - Multi-part Email',
    text: 'This is the plain text version for email clients that don\'t support HTML.',
    html: `
      <h1>Multi-part Email Test</h1>
      <p>This email has both <strong>HTML</strong> and <em>plain text</em> versions.</p>
      <p>Your email client should be displaying the HTML version right now.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Sent from Blade Mail Test Script</p>
    `,
  },
  {
    from: '"Grace Lee" <grace@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email #7 - Last One',
    text: 'Final test email in the batch.',
    html: `
      <h1>Last Test Email</h1>
      <p>This is the <span style="color: #e74c3c;">seventh</span> and final test email in this batch.</p>
      <p>Summary of sent emails: 7 total</p>
      <blockquote>
        "The best way to predict the future is to create it."
      </blockquote>
      <p>Thanks for using Blade Mail! 🎉</p>
    `,
  },
];

for (let i = 0; i < emails.length; i++) {
  try {
    const info = await transporter.sendMail(emails[i]);
    console.log(`✓ Email ${i + 1}/${emails.length} sent successfully!`);
    console.log(`  Subject: ${emails[i].subject}`);
    console.log(`  Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`✗ Email ${i + 1}/${emails.length} failed:`, error.message);
  }

  if (i < emails.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

console.log('\nBulk send complete!');
