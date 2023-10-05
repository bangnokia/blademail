<script setup lang="ts">
import type { Email } from '../../lib/types';
import { computed, ref } from 'vue'
import { checkAliveUrl } from '../../lib/utils';

const props = defineProps<{
  email: Email
}>()

const links = props.email.links

const errorCount = ref(0)
const total = ref(links.length)
const checkedCount = computed(() => links.filter(link => link.status !== 'pending').length)

async function checkUrls() {
  for (const link of links) {
    link.status = 'pending'
  }

  for (const link of links) {
    let isAlive = await checkAliveUrl(link.url)
    link.status = isAlive ? 'ok' : 'error'
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-4">
      <button @click="checkUrls" type="button" class="px-3 py-1.5 border border-gray-300 text-sm rounded">
        Check
      </button>
      <div class="flex items-center gap-3">
        <div>
          Checked: <span>{{ checkedCount }}/{{ total }}</span>
        </div>
        <div>
          Errors: <span :class="{ 'text-rose-500': errorCount }">{{ errorCount }}</span>
        </div>
      </div>
    </div>

    <table class=" w-full mt-4 border border-collapse">
      <tbody>
        <template v-for="link, index in links" :key="index">
          <tr :class="{ 'bg-rose-300': link.status === 'error' }">
            <td class="w-10 border text-center">{{ index + 1 }}</td>
            <td class="border px-3 py-1.5 break-all max-w-64">{{ link.url }}</td>
            <td class="border px-3 py-1 text-center w-8">
              {{ link.status }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>