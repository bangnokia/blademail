<script setup lang="ts">
import dayjs from "dayjs";
import { Email } from "../lib/types";
import { defineProps } from "vue";

defineProps<{
  email: Email;
}>()

function formatTime(date: Date) {
  return dayjs(date).format("HH:mm:ss");
}
</script>
<template>
  <div class="relative cursor-default rounded-md py-3 pl-7 pr-3">
    <template v-if="!email.isOpen">
      <span class="absolute left-2 top-4 block h-2 w-2 rounded-full bg-sky-500"></span>
    </template>
    <div class="relative flex flex-col gap-y-1">
      <div class="flex justify-between">
        <h3 class="text-sm font-semibold text-gray-900">{{ email.sender[0] }}</h3>
        <time class="text-xs text-gray-600">{{ formatTime(email.date) }}</time>
      </div>
      <div class="text-xs text-gray-900">{{ email.subject }}</div>
      <div class="line-clamp-2 text-xs text-gray-500">{{ email.excerpt }}</div>
    </div>
  </div>
</template>