<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import SmtpServer from "./components/SmtpServer.vue"
import { useAppStore } from './stores/appStore';

const appStore = useAppStore()

</script>

<template>
  <div>
    <h1 class="text-blue-500">This is home page</h1>
    <ul>
      <li v-for="email in appStore.emails" :key="email.id">{{ email.subject }}</li>
    </ul>
    <SmtpServer />
  </div>
</template>
