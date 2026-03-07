<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('laravel');

const configs: Record<string, string> = {
  laravel: `MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null`,
  django: `EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = '127.0.0.1'
EMAIL_PORT = 1025
EMAIL_USE_TLS = False
EMAIL_USE_SSL = False`,
  rails: `config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: '127.0.0.1',
  port: 1025,
  authentication: nil,
  enable_starttls_auto: false
}`,
  nodejs: `const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 1025,
  secure: false, // true for 465, false for other ports
});`,
  nextjs: `// pages/api/mail.js or app/api/mail/route.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 1025,
  secure: false,
});

export default async function handler(req, res) {
  await transporter.sendMail({
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Hello from Next.js',
    text: 'This is a test email',
  });
  res.status(200).json({ status: 'Ok' });
}`,
  nuxtjs: `// nuxt.config.js (using nuxt-mail module)
export default {
  modules: [
    ['nuxt-mail', {
      message: {
        to: 'recipient@example.com',
      },
      smtp: {
        host: '127.0.0.1',
        port: 1025,
      },
    }],
  ],
}`,
  wordpress: `// Add to functions.php
add_action( 'phpmailer_init', function( $phpmailer ) {
    $phpmailer->isSMTP();
    $phpmailer->Host = '127.0.0.1';
    $phpmailer->Port = 1025;
    $phpmailer->SMTPAuth = false;
    $phpmailer->SMTPSecure = false;
});`,
  go: `package main

import (
	"net/smtp"
)

func main() {
	// Set up authentication information.
	auth := smtp.PlainAuth("", "user@example.com", "password", "127.0.0.1")

	// Connect to the server, authenticate, set the sender and recipient,
	// and send the email all in one step.
	to := []string{"recipient@example.net"}
	msg := []byte("To: recipient@example.net\r\n" +
		"Subject: discount Gophers!\r\n" +
		"\r\n" +
		"This is the email body.\r\n")
	err := smtp.SendMail("127.0.0.1:1025", auth, "sender@example.org", to, msg)
	if err != nil {
		// handle error
	}
}`,
  python: `import smtplib

sender = "sender@example.com"
receiver = "receiver@example.com"
message = """\
Subject: Hi there

This message is sent from Python."""

with smtplib.SMTP("127.0.0.1", 1025) as server:
    server.sendmail(sender, receiver, message)`,
  java: `Properties props = new Properties();
props.put("mail.smtp.host", "127.0.0.1");
props.put("mail.smtp.port", "1025");

Session session = Session.getInstance(props, null);

try {
    MimeMessage msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress("sender@example.com"));
    msg.setRecipients(Message.RecipientType.TO, "receiver@example.com");
    msg.setSubject("Test Email");
    msg.setText("Hello from Java!");

    Transport.send(msg);
} catch (MessagingException e) {
    e.printStackTrace();
}`
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center bg-white p-8 overflow-y-auto">
    <div class="max-w-3xl w-full flex flex-col items-center gap-8">
      <!-- Hero Section -->
      <div class="text-center space-y-3">
        <p class="text-gray-500 max-w-md mx-auto">
          Blade Mail is listening on <code class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-sm">127.0.0.1:1025</code>.
          Send your first email to see it appear here instantly.
        </p>
      </div>

      <!-- Configuration Card -->
      <div class="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="bg-gray-50/80 px-4 py-3 border-b border-gray-100">
          <div class="flex gap-4 overflow-x-auto no-scrollbar">
            <button
              v-for="(_config, key) in configs"
              :key="key"
              @click="activeTab = key"
              class="text-sm transition-colors whitespace-nowrap capitalize"
              :class="activeTab === key ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'"
            >
              {{ key === 'nodejs' ? 'Node.js' : key }}
            </button>
          </div>
        </div>

        <div class="relative group bg-gray-50 h-64 overflow-y-auto">
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              @click="copyToClipboard(configs[activeTab])"
              class="p-1.5 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-colors shadow-sm"
              title="Copy to clipboard"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <pre class="p-5 overflow-x-auto text-[12px] font-mono leading-relaxed text-gray-600 select-all min-h-full">{{ configs[activeTab] }}</pre>
        </div>
      </div>

      <!-- Quick Tips -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-sm">
        <div class="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
          <h3 class="font-semibold text-gray-900 mb-1">Local Development</h3>
          <p class="text-gray-500">Perfect for testing emails in your local dev environment without sending real emails.</p>
        </div>
        <div class="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
          <h3 class="font-semibold text-gray-900 mb-1">Zero Configuration</h3>
          <p class="text-gray-500">No authentication required. Just point your SMTP client to port 1025.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>