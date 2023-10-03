<script setup lang="ts">
import { useAppStore } from "../stores/appStore";
import MailItem from "./MailItem.vue"
import { RouterLink } from "vue-router";

const { emails } = useAppStore()
</script>

<template>
  <div class="hidden h-full w-[322px] shrink-0 grow-0 flex-col border-r border-gray-300 text-white md:flex">
    <div class="toolbox sticky w-full top-0 z-20 flex items-end justify-between bg-white px-2 py-1 shadow-sm">
      <!-- <ButtonDeleteEmails /> -->
    </div>

    <div class="items-stretch overflow-y-auto p-2">
      <template v-for="email in emails" :key="email.id">
        <RouterLink :to="{ name: 'emails.show', params: { id: email.id } }">
          <MailItem :email="email" />
        </RouterLink>
      </template>
    </div>


    <template v-if="emails.length === 0">
      <div class="h-full flex items-center justify-center text-gray-500 text-sm">
        Your mailbox is clean
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.router-link-active {
  display: block;
  background-color: rgb(253 224 71);
  border-radius: 0.5rem;
}
</style>