<script setup lang="ts">
import { open } from "@tauri-apps/plugin-shell"
import { onMounted, ref } from "vue"

const { html } = defineProps<{
  html: string
}>()

const screen = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!screen.value) {
    return
  }

  let shadow = screen.value.attachShadow({ mode: "closed" })
  shadow.innerHTML = html
  shadow.querySelectorAll("a").forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      open(a.href)
    })
  });
})

</script>

<template>
  <div className="w-full h-full">
    <div ref="screen"></div>
  </div>
</template>