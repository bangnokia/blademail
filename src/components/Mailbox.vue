<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "../stores/appStore";
import MailItem from "./MailItem.vue"
import { RouterLink } from "vue-router";
import ButtonDeleteAllEmails from "./mailbox/ButtonDeleteAllEmails.vue";

const store = useAppStore()
const isBlank = computed(() => store.filteredEmails.length === 0)

</script>

<template>
  <div class="hidden h-full w-[260px] shrink-0 grow-0 flex-col border-r border-gray-200 bg-gray-50/90 text-gray-900 md:flex">
    <!-- toolbar -->
    <div class="flex items-center justify-between px-3 py-2 shrink-0">
      <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Inbox</h2>
      <ButtonDeleteAllEmails v-if="store.filteredEmails.length" @deleted="() => $router.push({ name: 'home' })" />
    </div>

    <!-- list email -->
    <div class="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
      <template v-for="email in store.filteredEmails" :key="email.id">
        <RouterLink :to="{ name: 'emails.show', params: { id: email.id } }">
          <MailItem :email="email" />
        </RouterLink>
      </template>
    </div>


    <template v-if="isBlank">
      <div class="h-full flex items-center justify-center text-gray-400 text-sm">
        No emails
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.router-link-active :deep(div) {
  background-color: rgb(229 231 235); /* gray-200 */
  color: rgb(17 24 39); /* gray-900 */
}
/* Ensure the active state overrides the default transparent bg of MailItem */
</style>