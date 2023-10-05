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
      class="toolbox sticky top-0 w-full z-20 flex items-center justify-between bg-white px-2 py-1 border-b text-gray-700">
      <!-- delete button -->
      <div>
        <button @click="deleteEmail" type="button" class="rounded flex items-center bg-white
          text-gray-500 px-2 py-1 text-xs hover:text-white hover:bg-rose-500 transition">
          <svg class="w-4 h-4 inline-block" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              stroke-linecap="round" stroke-linejoin="round"></path>
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