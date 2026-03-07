<script setup lang="ts">
import dayjs from "dayjs";
import { Email } from "../lib/types";

defineProps<{
  email: Email;
}>()

function formatTime(date: Date) {
  return dayjs(date).format("HH:mm:ss");
}
</script>
<template>
  <div class="relative cursor-default rounded-md py-2 pl-5 pr-3 transition-colors hover:bg-gray-200/50">
    <template v-if="!email.isOpen">
      <span class="absolute left-2 top-3 block h-2 w-2 rounded-full bg-blue-500"></span>
    </template>
    <div class="relative flex flex-col gap-y-0.5">
      <div class="flex justify-between items-baseline">
        <h3 class="text-sm font-semibold text-gray-900 truncate pr-2">{{ email.sender[0] }}</h3>
        <time class="text-xs text-gray-500 shrink-0">{{ formatTime(email.date) }}</time>
      </div>
      <div class="text-xs font-medium text-gray-700 truncate">{{ email.subject }}</div>
      <div class="line-clamp-2 text-xs text-gray-500">{{ email.excerpt }}</div>
    </div>
  </div>
</template>