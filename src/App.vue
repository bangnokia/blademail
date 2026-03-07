<script setup lang="ts">
import SmtpServer from "./components/SmtpServer.vue"
import Mailbox from './components/Mailbox.vue'
import Sidebar from './components/Sidebar.vue'
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from './stores/appStore'
import StatusBar from "./components/StatusBar.vue";
// import { createFakeEmails } from './lib/mock'

const { emails } = useAppStore()

const sidebarWidth = ref(200);
const mailboxWidth = ref(260);
const isResizingSidebar = ref(false);
const isResizingMailbox = ref(false);

const startResizeSidebar = () => {
  isResizingSidebar.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const startResizeMailbox = () => {
  isResizingMailbox.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const onMouseMove = (e: MouseEvent) => {
  if (isResizingSidebar.value) {
    const newWidth = e.clientX;
    if (newWidth > 150 && newWidth < 400) {
      sidebarWidth.value = newWidth;
    }
  } else if (isResizingMailbox.value) {
    const newWidth = e.clientX - sidebarWidth.value;
    if (newWidth > 200 && newWidth < 600) {
      mailboxWidth.value = newWidth;
    }
  }
};

const onMouseUp = () => {
  isResizingSidebar.value = false;
  isResizingMailbox.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

onMounted(() => {
  // createFakeEmails(10)
})
</script>

<template>
  <div
    class="flex h-screen w-screen flex-col bg-white font-sans overflow-hidden"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div class="flex flex-1 overflow-hidden">
      <div v-show="emails.length > 0" class="shrink-0 relative flex" :style="{ width: `${sidebarWidth}px` }">
        <Sidebar class="w-full h-full" />
        <div
          class="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-600 z-10 transition-colors opacity-0 hover:opacity-100 active:opacity-100"
          @mousedown.prevent="startResizeSidebar"
        ></div>
      </div>

      <div v-show="emails.length > 0" class="shrink-0 relative flex" :style="{ width: `${mailboxWidth}px` }">
        <Mailbox class="w-full h-full" />
        <div
          class="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-600 z-10 transition-colors opacity-0 hover:opacity-100 active:opacity-100"
          @mousedown.prevent="startResizeMailbox"
        ></div>
      </div>

      <div class="flex flex-col flex-1 h-full min-w-0 bg-white">
        <div class="flex-1 overflow-auto relative">
          <RouterView />
        </div>
      </div>
    </div>

    <div class="shrink-0 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm relative z-50 pointer-events-auto">
      <StatusBar />
    </div>
    <SmtpServer />
  </div>
</template>
