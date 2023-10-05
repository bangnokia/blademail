<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { SpamReport, Email } from '../../lib/types';
import { checkSpam } from '../../lib/utils';

const emit = defineEmits(['updateSpamScore'])
const props = defineProps<{
  email: Email
}>()

const result = ref<SpamReport | undefined>()

onMounted(async () => {
  const response = await checkSpam(props.email.html)
  result.value = response

  emit('updateSpamScore', response.score)
})
</script>

<template>
  <div v-if="result">
    <div class="text-lg font-medium">Score: {{ result.score }}</div>
    <table class="w-full mt-4 border border-collapse">
      <tbody>
        <tr v-for="rule in result.rules" :key="rule.description">
          <td class="w-10 border text-right pr-1 tabular-nums">{{ rule.score }}</td>
          <td class="border px-3 py-1.5 break-all max-w-64">{{ rule.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <div class="text-lg font-medium">Loading...</div>
  </div>
</template>