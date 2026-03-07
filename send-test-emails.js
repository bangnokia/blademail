import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST ?? '127.0.0.1'
const port = Number(process.env.SMTP_PORT ?? '1025')
const delayMs = Number(process.env.SEED_DELAY_MS ?? '350')

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
})

const emails = [
  {
    from: '"Alice Johnson" <alice@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Welcome to Blade Mail',
    text: 'Welcome to Blade Mail. This is the plain text version.',
    html: '<h1>Welcome</h1><p>This is a <strong>test email</strong> for your local inbox.</p>',
  },
  {
    from: '"Orders" <orders@example.com>',
    to: 'inbox@blademail.test',
    cc: 'billing@example.com',
    subject: 'Order confirmation #BM-1024',
    text: 'Your order has been confirmed. Total: $79.98',
    html: [
      '<h2>Order confirmation</h2>',
      '<p>Thanks for your purchase.</p>',
      '<table border="1" cellpadding="8" cellspacing="0">',
      '<tr><th>Item</th><th>Price</th></tr>',
      '<tr><td>Blade Mail Pro</td><td>$79.98</td></tr>',
      '</table>',
    ].join(''),
  },
  {
    from: '"Security" <security@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Password reset request',
    text: 'Use this link to reset your password: https://example.com/reset?token=abc123',
    html: [
      '<h2>Password reset</h2>',
      '<p>We received a password reset request.</p>',
      '<p><a href="https://example.com/reset?token=abc123">Reset your password</a></p>',
    ].join(''),
  },
  {
    from: '"Marketing" <marketing@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Weekly newsletter',
    text: 'Top stories this week: product launch, community spotlight, and events.',
    html: [
      '<h1>Weekly newsletter</h1>',
      '<ul>',
      '<li>New feature launch</li>',
      '<li>Upcoming events</li>',
      '<li>Community spotlight</li>',
      '</ul>',
      '<p><a href="https://example.com/unsubscribe">Unsubscribe</a></p>',
    ].join(''),
  },
  {
    from: '"Reports" <reports@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Attachment test',
    text: 'This email includes an attachment so you can test attachment rendering.',
    html: '<p>This email includes a JSON attachment.</p>',
    attachments: [
      {
        filename: 'report.json',
        contentType: 'application/json',
        content: JSON.stringify({ status: 'ok', generatedAt: new Date().toISOString() }, null, 2),
      },
    ],
  },
  {
    from: '"Support" <support@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Multipart email with links',
    text: 'Please review https://blademail.app and https://github.com/bangnokia/blademail',
    html: [
      '<h1>Links to verify</h1>',
      '<p>Project site: <a href="https://blademail.app">blademail.app</a></p>',
      '<p>Repository: <a href="https://github.com/bangnokia/blademail">GitHub repo</a></p>',
      '<img src="https://placehold.co/320x120/png" alt="Banner" />',
    ].join(''),
  },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendSeedEmails() {
  console.log(`Seeding ${emails.length} test emails to smtp://${host}:${port}`)

  for (const [index, email] of emails.entries()) {
    try {
      const info = await transporter.sendMail(email)
      console.log(`✓ ${index + 1}/${emails.length} ${email.subject}`)
      console.log(`  messageId: ${info.messageId}`)
    } catch (error) {
      console.error(`✗ ${index + 1}/${emails.length} ${email.subject}`)
      console.error(`  ${error instanceof Error ? error.message : String(error)}`)
    }

    if (index < emails.length - 1) {
      await sleep(delayMs)
    }
  }

  console.log('Done seeding test emails.')
}

await sendSeedEmails()