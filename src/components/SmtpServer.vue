<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { startSmtpServer, stopSmtpServer } from '../lib/smtp'
import { listen, Event } from "@tauri-apps/api/event"
import type { Email } from "../lib/types"
import { nanoid } from "nanoid"
import { makeExcerpt, parseUrls } from "../lib/utils"
import { ref } from "vue"
import { useAppStore } from "../stores/appStore"
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const { create } = appStore
const router = useRouter()

async function start() {
  await startSmtpServer()
  console.log("SMTP server started")
}

// actually I don't know how to stop the server
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

    create(email)

    if (appStore.openNewEmail) {
      router.push({ name: 'emails.show', params: { id: email.id } })
    }
  })
})

onBeforeUnmount(() => unlisten.value())
</script>

<template></template>