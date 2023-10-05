import { defineStore } from 'pinia'
import { EmailLink } from '../lib/types'
import { ref } from 'vue'
import { checkAliveUrl } from '../lib/utils'

export const linksCheckerStore = defineStore('linksChecker', () => {
  const links = ref<EmailLink[]>([])

  async function checkAll() {
    // set all links status to pending
    for (const link of links.value) {
      link.status = 'pending'
    }

    for (const link of links.value) {
      let isAlive = await checkAliveUrl(link.url)
      link.status = isAlive ? 'ok' : 'error'
    }
  }

  return {
    links
  }
})
