<script setup lang="ts">
import type { Email } from '../../lib/types';
import { ref } from 'vue'
import LinkCheckerRow from './LinkCheckerRow.vue';

const props = defineProps<{
  email: Email
}>()

const links = props.email.links

const checkedCount = ref(0)
const errorCount = ref(0)
const total = ref(links.length)

function checkUrls() {

}

function handleLinkCheckFinished() {

}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-4">
      <button @click="checkUrls" type="button" class="px-3 py-1.5 border border-gray-300 text-sm rounded">Recheck</button>
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
          <LinkCheckerRow :link="link" :index="index" @onFinished="handleLinkCheckFinished" />
        </template>
      </tbody>
    </table>
  </div>
</template>