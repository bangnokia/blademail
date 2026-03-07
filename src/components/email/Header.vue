<script setup lang="ts">
import type { Attachment, Email } from '../../lib/types';


const { email, size } = defineProps<{
  email: Email,
  size?: number
}>()

const emit = defineEmits<{
  (e: 'delete'): void
}>()

function downloadAttachment(attachment: Attachment) {
  // download the attachment.data
  const blob = new Blob([attachment.data], { type: attachment.content_type })
  const url = URL.createObjectURL(blob)
  return url;
}
</script>
<template>
  <header class="relative px-4 py-3 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
    <!-- Top Row: Subject + Actions -->
    <div class="flex items-start justify-between gap-4 mb-1.5">
      <h1 class="text-sm font-semibold text-gray-900 leading-snug break-words flex-1 select-text">
        {{ email.subject.trim() || '(No Subject)' }}
      </h1>
      
      <div class="flex items-center gap-3 shrink-0 pt-0.5">
        <span v-if="size" class="text-[10px] text-gray-400 font-mono tracking-tight">
          {{ Math.round(size / 1024) }} KB
        </span>
        
        <button 
          @click="$emit('delete')" 
          type="button" 
          title="Delete Email"
          class="text-gray-400 hover:text-rose-500 transition-colors p-1 -mr-1 rounded hover:bg-rose-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-gray-600">
      <!-- From -->
      <div class="text-gray-400 text-right select-none w-10">From:</div>
      <div class="select-text truncate">
        <span class="font-medium text-gray-800">{{ email.sender[0] }}</span> 
        <span class="text-gray-500 ml-1">&lt;{{ email.sender[1] }}&gt;</span>
      </div>

      <!-- To -->
      <div class="text-gray-400 text-right select-none">To:</div>
      <div class="select-text truncate" :title="email.to.join(', ')">
        {{ email.to.join(", ") }}
      </div>

      <!-- Cc -->
      <template v-if="email.cc && email.cc.length">
        <div class="text-gray-400 text-right select-none">Cc:</div>
        <div class="select-text truncate" :title="email.cc.join(', ')">
          {{ email.cc.join(", ") }}
        </div>
      </template>
    </div>

    <!-- Attachments -->
    <div v-if="email.attachments?.length" class="mt-2 pt-2 border-t border-gray-100">
      <div class="flex flex-wrap gap-2">
        <a 
          v-for="attachment in email.attachments" 
          :key="attachment.filename"
          :href="downloadAttachment(attachment)" 
          download 
          class="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-[11px] text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
        >
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span class="truncate max-w-[150px]">{{ attachment.filename }}</span>
        </a>
      </div>
    </div>
  </header>
</template>