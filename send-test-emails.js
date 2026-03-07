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
  // Emails from Alice
  {
    from: '"Alice Johnson" <alice@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Welcome to Blade Mail',
    text: 'Welcome to Blade Mail. This is the plain text version.',
    html: '<h1>Welcome</h1><p>This is a <strong>test email</strong> for your local inbox.</p>',
  },
  {
    from: '"Alice Johnson" <alice@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Project Update',
    text: 'The project is moving along nicely.',
    html: '<p>The project is moving along <strong>nicely</strong>.</p>',
  },
  {
    from: '"Alice Johnson" <alice@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Meeting Notes',
    text: 'Here are the notes from our meeting.',
    html: '<ul><li>Point 1</li><li>Point 2</li></ul>',
  },

  // Emails from Bob
  {
    from: '"Bob Smith" <bob@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Invoice #1001',
    text: 'Please find attached invoice #1001.',
    html: '<p>Please find attached invoice #1001.</p>',
  },
  {
    from: '"Bob Smith" <bob@example.com>',
    to: 'inbox@blademail.test',
    subject: 'Question about the design',
    text: 'Can we change the color of the button?',
    html: '<p>Can we change the color of the button?</p>',
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