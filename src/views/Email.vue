<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watch, ref, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore';
import type { Email } from '../lib/types';
import BodyTabs from '../components/email/BodyTabs.vue'
import Header from '../components/email/Header.vue';
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
  <div class="relative h-full w-full overflow-auto bg-white" v-if="email" data-email-id="id" :key="id">
    <Header :email="email" :size="size" @delete="deleteEmail" />

    <main class="relative h-full w-full">
      <BodyTabs :email="email" />
    </main>
  </div>
</template>