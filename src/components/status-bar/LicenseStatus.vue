<script setup lang="ts">
import Key from '../icons/Key.vue'
import { ref, computed, onMounted } from 'vue'
import { getLicense, verify } from '../../stores/license'

const valid = ref<boolean>(true)
const license = ref<string>('')
const registered = computed(() => Boolean(license.value) && valid.value)

const loading = ref(false)
const error = ref('')

const open = ref(false)

onMounted(async () => {
  const licenseString = await getLicense()
  license.value = licenseString + ''

  if (license.value) {
    const isValid = await verify(license.value)

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
  <!-- license status -->
  <div class="relative">
    <button type="button" @click="open = !open" class="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
      <template v-if="!registered">
        <span class="text-gray-500 hover:text-gray-900">Unregistered</span>
      </template>
      <template v-else>
         <span class="text-emerald-600 font-semibold">Registered</span>
      </template>
      <Key class="w-3.5 h-3.5 text-gray-400" />
    </button>

    <!-- Popover Menu -->
    <div v-if="open" class="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-50">
      <form class="flex flex-col gap-3" @submit.prevent="submit">
        <div class="flex flex-col gap-1.5">
          <label for="license-key" class="text-xs font-semibold text-gray-700">License Key</label>
          <input
            type="text"
            id="license-key"
            placeholder="Enter license key"
            v-model="license"
            class="w-full text-xs px-2 py-1.5 rounded border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          <p v-show="error" class="text-rose-500 text-[10px]">{{ error }}</p>
        </div>

        <div class="flex items-center justify-end gap-2 pt-1">
          <button @click="open = false" type="button" class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors">Cancel</button>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || !license">
            Verify License
          </button>
        </div>
      </form>
    </div>

    <!-- Backdrop for closing -->
    <div v-if="open" @click="open = false" class="fixed inset-0 z-40"></div>
  </div>
</template>