<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { startSmtpServer, stopSmtpServer } from '../lib/smtp'
import { listen, Event } from "@tauri-apps/api/event"
import { type Email } from "../lib/types"
import {nanoid} from "nanoid"
import { makeExcerpt, parseUrls } from "../lib/utils"
import { ref } from "vue"
import { useAppStore } from "../stores/appStore"

const {addEmail} = useAppStore()

async function start() {
  await startSmtpServer()
  console.log("SMTP server started")
}

async function stop() {
  await stopSmtpServer()
  console.log("SMTP server stopped")
}

const unlisten = ref()

onBeforeMount(() => start())

onMounted(() => {
  unlisten.value = listen("new-email", (event: Event<Email>) => {
    const email: Email = {
      ...event.payload,
      id: nanoid(),
      excerpt: makeExcerpt(event.payload),
      date: new Date(),
      isOpen: false,
      links: parseUrls(event.payload.html).map((url) => ({ url, status: 'pending' })),
    };

    addEmail(email)
  })
})

onBeforeUnmount(() => unlisten.value())
</script>

<template>
  <button type="button" @click="start">Start</button>
  <button type="button" @click="stop">Stop</button>
</template>