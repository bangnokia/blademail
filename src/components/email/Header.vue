<script setup lang="ts">
import type { Attachment, Email } from '../../lib/types';


const { email } = defineProps<{
  email: Email
}>()

function downloadAttachment(attachment: Attachment) {
  // download the attachment.data
  const blob = new Blob([attachment.data], { type: attachment.content_type })
  const url = URL.createObjectURL(blob)
  return url;
}
</script>
<template>
  <header class="grid grid-cols-1 px-5 py-3 lg:grid-cols-2 text-sm">
    <div class="flex gap-x-5 py-1">
      <div class="upp w-24 font-semibold">Subject:</div>
      <div class="font-semibold uppercase">{{ email.subject.trim() }}</div>
    </div>
    <div class="flex gap-x-5 py-1">
      <div class="w-24 font-semibold">From:</div>
      <div>
        {{ email.sender[0] }} {{ `<${email.sender[1]}>` }}
      </div>
    </div>
    <div class="flex gap-x-5 py-1">
      <div class="w-24 font-semibold">To:</div>
      <div>{{ email.to.join(", ") }}</div>
    </div>
    <div v-if="email.cc" class="flex gap-x-5 py-1">
      <div class="w-24 font-semibold">Cc:</div>
      <div>{{ email.cc.join(", ") }}</div>
    </div>

    <div v-if="email.attachments?.length" class="text-sm lg:col-span-2">
      <h3 class="font-medium">Attachments</h3>
      <ul class="mt-2 text-xs font-mono gap-y-2">
        <li v-for="attachment in email.attachments">
          <a :href="downloadAttachment(attachment)" download class="flex gap-2 hover:underline">
            <svg class="w-4 h-4 inline-block" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            {{ attachment.filename }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>