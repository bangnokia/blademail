<script setup lang="ts">
import { onBeforeRouteUpdate, routerKey, useRoute } from 'vue-router';
import { watch, ref, unref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore';
import type { Email } from '../lib/types';
import BodyTabs from '../components/email/BodyTabs.vue'
import router from '../route';

const props = defineProps<{
  id: string
}>()

const id = ref(props.id)

const route = useRoute()
const { find, markOpenEmail, destroy, emails } = useAppStore()
const email = ref<Email>();
const size = ref(0)

onMounted(() => {
  loadEmail(id.value)
})

watch(
  () => route.params.id,
  (emailId) => loadEmail(emailId.toString())
)

function loadEmail(emailId: string) {
  id.value = emailId.toString()
  email.value = find(id.value)
  if (email.value) {
    size.value = new Blob([email.value.raw]).size || 0
  }

  markOpenEmail(id.value)
}

function deleteEmail() {
  // find the previous email, if any
  let nextId: string = '';

  if (emails.length > 1) {
    const index = emails.findIndex((email) => email.id === id.value)
    const nextIndex = index === 0 ? 1 : index - 1
    nextId = emails[nextIndex].id
  }

  destroy(id.value)

  if (nextId) {
    router.push({ name: 'emails.show', params: { id: nextId } })
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="relative h-full w-full overflow-auto" v-if="email" data-email-id="id" :key="id">
    <div
      class="toolbox sticky top-0 w-full z-20 flex items-center justify-between bg-white px-2 py-1 shadow-sm text-gray-700">
      <!-- delete button -->
      <div>
        <button @click="deleteEmail" type="button" class="rounded flex items-center bg-white
          text-gray-500 px-2 py-1 text-xs hover:text-white hover:bg-rose-500 transition">
          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <!-- email size -->
      <div>
        <span class="text-xs font-medium">Size: {{ Math.round(size / 1024) }} KB</span>
      </div>
    </div>

    <header class="grid grid-cols-1 px-5 py-3 lg:grid-cols-2 text-sm">
      <div class="flex gap-x-5 py-1">
        <div class="upp w-24 font-semibold">Subject:</div>
        <div class="font-semibold uppercase">{{ email.subject.trim() }}</div>
      </div>
      <div class="flex gap-x-5 py-1">
        <div class="w-24 font-semibold">From:</div>
        <div>
          {{ email.sender[0] }} {{ `<${email.sender[1]}>` }}
        </div>
      </div>
      <div class="flex gap-x-5 py-1">
        <div class="w-24 font-semibold">To:</div>
        <div>{{ email.to.join(", ") }}</div>
      </div>
      <div v-if="email.cc" class="flex gap-x-5 py-1">
        <div class="w-24 font-semibold">Cc:</div>
        <div>{{ email.cc.join(", ") }}</div>
      </div>
    </header>

    <main class="relative h-full w-full">
      <BodyTabs :email="email" />
    </main>
  </div>
</template>