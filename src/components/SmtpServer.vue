<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { listen, type Event } from '@tauri-apps/api/event'
import type { Email } from "../lib/types"
import { nanoid } from "nanoid"
import { makeExcerpt, parseUrls } from "../lib/utils"
import { startSmtpServer, stopSmtpServer } from '../lib/smtp'
import { useAppStore } from "../stores/appStore"
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const { create } = appStore
const router = useRouter()
let unlisten: null | (() => void) = null

function errorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown SMTP server error.'
}

async function start() {
  appStore.setSmtpStarting()

  try {
    const message = await startSmtpServer()
    appStore.setSmtpRunning(message)
    console.log(message)
  } catch (error) {
    const message = errorMessage(error)
    appStore.setSmtpError(message)
    console.error('Failed to start SMTP server', error)
  }
}

async function stop() {
  appStore.setSmtpStopping()

  try {
    const message = await stopSmtpServer()
    appStore.setSmtpStopped(message)
    console.log(message)
  } catch (error) {
    const message = errorMessage(error)
    appStore.setSmtpError(message)
    console.error('Failed to stop SMTP server', error)
  }
}

onMounted(async () => {
  unlisten = await listen('new-email', (event: Event<Email>) => {
    const payload = event.payload
    const email: Email = {
      ...payload,
      id: nanoid(),
      excerpt: makeExcerpt(payload),
      date: new Date(),
      isOpen: false,
      links: parseUrls(payload.html).map((url) => ({ url, status: 'pending' })),
      attachments: payload.attachments,
    }

    create(email)

    if (appStore.openNewEmail) {
      router.push({ name: 'emails.show', params: { id: email.id } })
    }
  })

  await start()
})

onBeforeUnmount(() => {
  unlisten?.()
  unlisten = null
  void stop()
})
</script>

<template></template>