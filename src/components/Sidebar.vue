<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { storeToRefs } from 'pinia';

const store = useAppStore();
const { senders, selectedSender, emails } = storeToRefs(store);

function selectSender(sender: string | null) {
  store.selectedSender = sender;
}
</script>

<template>
  <div class="flex h-full w-[200px] shrink-0 flex-col border-r border-gray-200 bg-gray-100 text-gray-900">
    <div class="p-3">
      <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Mailboxes</h2>

      <div class="space-y-1">
        <button
          @click="selectSender(null)"
          class="w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="!selectedSender ? 'bg-white shadow-sm font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'"
        >
          <div class="flex items-center justify-between">
            <span>All Messages</span>
            <span class="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">{{ emails.length }}</span>
          </div>
        </button>

        <template v-for="sender in senders" :key="sender.email">
          <button
            @click="selectSender(sender.email)"
            class="w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors truncate"
            :class="selectedSender === sender.email ? 'bg-white shadow-sm font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'"
            :title="sender.email"
          >
            {{ sender.email }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
