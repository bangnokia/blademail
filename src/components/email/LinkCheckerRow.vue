<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { EmailLink, EmailLinkStatus } from '../../lib/types';
import { getClient, ResponseType } from "@tauri-apps/api/http"
import { checkAliveUrl } from "../../lib/utils";


const emit = defineEmits(['onFinished'])

const { link } = defineProps<{
  link: EmailLink,
  index: number,
}>()

const checking = ref(false)
const status = ref<EmailLinkStatus>(link.status)

onMounted(() => {
  checkUrl()
})

async function checkUrl() {
  checking.value = true
  let newStatus = status.value

  const isAlive = await checkAliveUrl(link.url)

  status.value = isAlive ? 'ok' : 'error'
  checking.value = false
  emit('onFinished', link, newStatus)
}

</script>

<template>
  <tr>
    <td class="w-10 border text-center">{{ index + 1 }}</td>
    <td class="border px-3 py-1.5 break-all max-w-64">{{ link.url }}</td>
    <td class="border px-3 py-1 text-center w-8">
      {{ status }}
    </td>
  </tr>
</template>