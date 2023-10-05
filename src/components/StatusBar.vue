<script setup lang="ts">
import LicenseStatus from './status-bar/LicenseStatus.vue'
import { useAppStore } from '../stores/appStore';

const { openNewEmail } = useAppStore()
</script>

<template>
  <div className="bg-neutral-200 px-3 py-1 text-xs text-gray-700 flex items-center justify-between font-mono">
    <!-- quick setting -->
    <div>
      <!-- open new email setting -->
      <div class="flex items-center gap-1">
        <span class="">Open new email</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="openNewEmail" class="sr-only peer">
          <div class="w-8 h-4 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:bg-yellow-400
             peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300
            after:border after:rounded-full after:h-4 after:w-4 after:transition-all">
          </div>
        </label>
      </div>
    </div>

    <!-- license status -->
    <LicenseStatus />
  </div>
</template>