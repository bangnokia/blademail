<script setup lang="ts">
import { randomQuote } from "../lib/quotes"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const quote = randomQuote()
// split the quote and the author from the quote by '-'
const [quoteText, quoteAuthor] = quote.split("-")

const configs = {
  laravel: `MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null`,
  symfony: `# config/packages/mailer.yaml
framework:
    mailer:
        dsn: 'smtp://127.0.0.1:1025'`,
  wordpress: `// wp-config.php
define( 'SMTP_HOST', '127.0.0.1' );
define( 'SMTP_PORT', '1025' );
define( 'SMTP_AUTH', false );
define( 'SMTP_USERNAME', '' );
define( 'SMTP_PASSWORD', '' );`
}
</script>

<template>
  <div class="flex h-full w-full mx-auto max-w-2xl flex-col items-center justify-center gap-y-10 p-10">
    <div class="flex flex-col gap-y-5">
      <div class="leading-6 font-mono tracking-wide text-rose-500">
        <div>{{ quoteText }}</div>
        <div class="italic">- {{ quoteAuthor }}</div>
      </div>
      <hr class="h-px w-48 bg-gray-300" />
    </div>
    <div class="flex w-full flex-col tracking-wide gap-y-5 rounded-md p-5 text-sm text-gray-500">
      <div>
        Blade Mail runs its built-in SMTP server on
        <code class="rounded bg-rose-400 px-1 py-0.5 text-xs text-white">127.0.0.1:1025</code>. <br />
        So please ensure you don't have any other processes running on that port.
      </div>
      <div class="flex flex-col space-y-3">
        <h4 class="font-semibold tracking-wide">Example configuration</h4>
        <Tabs default-value="laravel" class="w-full">
          <TabsList>
            <TabsTrigger value="laravel">Laravel</TabsTrigger>
            <TabsTrigger value="symfony">Symfony</TabsTrigger>
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          </TabsList>
          <TabsContent value="laravel">
            <pre class="relative select-all rounded bg-gray-500 px-7 py-3 font-mono text-sm leading-6 text-white min-h-[169px]">{{ configs.laravel }}</pre>
          </TabsContent>
          <TabsContent value="symfony">
            <pre class="relative select-all rounded bg-gray-500 px-7 py-3 font-mono text-sm leading-6 text-white min-h-[169px]">{{ configs.symfony }}</pre>
          </TabsContent>
          <TabsContent value="wordpress">
            <pre class="relative select-all rounded bg-gray-500 px-7 py-3 font-mono text-sm leading-6 text-white min-h-[169px]">{{ configs.wordpress }}</pre>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>