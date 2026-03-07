<script setup lang="ts">
import type { Attachment, Email } from '../../lib/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { email, size } = defineProps<{
  email: Email,
  size?: number
}>()

defineEmits<{
  (e: 'delete'): void
}>()

function downloadAttachment(attachment: Attachment) {
  // download the attachment.data
  const blob = new Blob([attachment.data], { type: attachment.content_type })
  const url = URL.createObjectURL(blob)
  return url;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  // Optional: Could add a toast notification here
}
</script>
<template>
  <header class="relative px-5 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
    <!-- Actions (Absolute) -->
    <div class="absolute top-4 right-5 flex items-center gap-3 z-10">
      <span v-if="size" class="text-[10px] text-gray-400 font-mono tracking-tight">
        {{ Math.round(size / 1024) }} KB
      </span>

      <button
        @click="$emit('delete')"
        type="button"
        title="Delete Email"
        class="text-gray-400 hover:text-rose-600 transition-colors p-1.5 -mr-1.5 rounded-md hover:bg-rose-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Subject -->
    <div class="mb-1 pr-24">
      <h1 class="text-lg font-semibold text-gray-900 leading-snug break-words select-text tracking-tight">
        {{ email.subject.trim() || '(No Subject)' }}
      </h1>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm text-gray-600">
      <!-- From -->
      <div class="text-gray-400 text-right select-none w-12 pt-0.5">From:</div>
      <div class="flex items-center gap-2 min-w-0">
        <div class="flex items-baseline gap-1.5 min-w-0 truncate select-text group cursor-pointer" @click="copyToClipboard(`${email.sender[0]} <${email.sender[1]}>`)" title="Click to copy">
          <span class="font-medium text-gray-900 truncate">{{ email.sender[0] }}</span>
          <span class="text-gray-500 truncate">&lt;{{ email.sender[1] }}&gt;</span>
        </div>
      </div>

      <!-- To -->
      <div class="text-gray-400 text-right select-none pt-0.5">To:</div>
      <div class="flex items-center gap-2 min-w-0">
        <div class="select-text truncate text-gray-700 cursor-pointer hover:text-gray-900" :title="email.to.join(', ')" @click="copyToClipboard(email.to.join(', '))">
          {{ email.to.join(", ") }}
        </div>
      </div>

      <!-- Cc -->
      <template v-if="email.cc && email.cc.length">
        <div class="text-gray-400 text-right select-none pt-0.5">Cc:</div>
        <div class="select-text truncate text-gray-700 cursor-pointer hover:text-gray-900" :title="email.cc.join(', ')" @click="copyToClipboard(email.cc.join(', '))">
          {{ email.cc.join(", ") }}
        </div>
      </template>
    </div>

    <!-- Attachments -->
    <div v-if="email.attachments?.length" class="mt-4 pt-3 border-t border-gray-100">
      <div class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Attachments</div>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="attachment in email.attachments"
          :key="attachment.filename"
          :href="downloadAttachment(attachment)"
          download
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span class="truncate max-w-[200px] font-medium">{{ attachment.filename }}</span>
        </a>
      </div>
    </div>
  </header>
</template>