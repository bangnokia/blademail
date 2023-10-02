<script setup lang="ts">
import SmtpServer from "./components/SmtpServer.vue"
import Mailbox from './components/Mailbox.vue'
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { createFakeEmails } from './lib/mock'


onMounted(() => {
  createFakeEmails(10)
})

</script>

<template>
  <div class="flex h-screen w-screen flex-col bg-white font-sans">
    <div class="flex h-full w-full overflow-auto">
      <Mailbox />
      <RouterView />
      <!-- <CurrentEmail /> -->
    </div>
    <div class="bottom-0 w-full shrink-0 grow-0">
      <!-- <StatusBar /> -->
    </div>
    <SmtpServer />
  </div>
</template>
