<script setup lang="ts">
import Key from '../icons/Key.vue'
import { ref, computed, onMounted } from 'vue'
import { getLicense, verify } from '../../stores/license'

const valid = ref<boolean>(true)
const license = ref<string>('')
const registered = computed(() => license.value && valid.value)

const loading = ref(false)
const error = ref('')

const open = ref(false)

onMounted(async () => {
  const licenseString = await getLicense()
  license.value = licenseString + '';

  if (license.value) {
    const isValid = await verify(license.value)
    console.log('response', isValid)

    valid.value = isValid
  }
})

async function submit() {
  loading.value = true

  const isValid = await verify(license.value)

  loading.value = false

  if (!isValid) {
    error.value = 'Your license key is invalid'
    valid.value = false
    return
  }

  error.value = ''
  valid.value = true
  open.value = false
}
</script>

<template>
  <div class="flex items-center justify-center gap-1">
    <template v-if="!registered">
      <span class="text-gray-500">Unregistered</span>
    </template>
    <button type="button" @click="open = true">
      <Key class="w-4 h-4" />
    </button>
  </div>

  <div v-show="open" class="fixed inset-0 w-screen h-screen z-40 bg-gray-500/40 grid place-items-center">
    <form class="inset-0 bg-white flex flex-col gap-6 px-8 py-6 rounded-md shadow" @submit.prevent="submit">
      <div class="flex flex-col gap-2">
        <label htmlFor="license-key" class="text-base font-medium">License key</label>
        <input type="text" id="license-key" placeholder="Your license key" v-model="license"
          class="w-[400px] select-all text-sm rounded border-gray-300 focus:border-sky-500 focus:ring-sky-500" />
        <p v-show="error" class="text-rose-500 text-sm">{{ error }}</p>
      </div>

      <div class="flex items-center justify-end gap-2">
        <button @click="open = false" type="button" class="text-gray-500 px-4 py-2 rounded">Cancel</button>
        <button type="submit" class="bg-rose-500 text-white px-4 py-2 rounded disabled:bg-opacity-50"
          :disabled="loading || !license">
          Save
        </button>
      </div>
    </form>

  </div>
</template>