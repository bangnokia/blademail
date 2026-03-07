<script setup lang="ts">
import SmtpServer from "./components/SmtpServer.vue"
import Mailbox from './components/Mailbox.vue'
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAppStore } from './stores/appStore'
import StatusBar from "./components/StatusBar.vue";
// import { createFakeEmails } from './lib/mock'

const { emails } = useAppStore()

onMounted(() => {
  // createFakeEmails(10)
})
</script>

<template>
  <div class="flex h-screen w-screen flex-col bg-white font-sans overflow-hidden">
    <div class="flex flex-1 overflow-hidden">
      <Mailbox v-show="emails.length > 0" />
      
      <div class="flex flex-col flex-1 h-full min-w-0 bg-white">
        <div class="flex-1 overflow-auto relative">
          <RouterView />
        </div>
      </div>
    </div>
    
    <div class="shrink-0 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
      <StatusBar />
    </div>
    <SmtpServer />
  </div>
</template>
