<script setup lang="ts">
import { computed } from 'vue'
import LicenseStatus from './status-bar/LicenseStatus.vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

const smtpIndicatorClass = computed(() => {
  if (appStore.smtpStatus === 'running') return 'bg-emerald-500'
  if (appStore.smtpStatus === 'starting' || appStore.smtpStatus === 'stopping') return 'bg-amber-500'
  if (appStore.smtpStatus === 'error') return 'bg-rose-500'

  return 'bg-slate-400'
})
</script>

<template>
  <div class="flex items-center justify-between bg-transparent px-3 py-1.5 text-xs text-gray-600">
    <div class="flex items-center gap-4 font-medium">
      <!-- open new email setting -->
      <div class="flex items-center gap-2">
        <span class="">Auto-open new email</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="appStore.openNewEmail" class="sr-only peer">
          <div class="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer
            after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all
            peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white">
          </div>
        </label>
      </div>

      <div class="h-3 w-px bg-gray-300 mx-1"></div>

      <div
        class="flex items-center gap-2 text-[10px]"
        :title="appStore.smtpStatus === 'error' ? appStore.smtpMessage : undefined"
      >
        <span :class="smtpIndicatorClass" class="h-1.5 w-1.5 rounded-full"></span>
        <span class="uppercase tracking-wider text-gray-500 font-semibold">SMTP</span>
      </div>
    </div>
    
    <!-- license status -->
    <LicenseStatus />
  </div>
</template>