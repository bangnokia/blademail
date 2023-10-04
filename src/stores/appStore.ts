import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Email } from '../lib/types'
import { useRouter } from 'vue-router'

export const useAppStore = defineStore('appStore', () => {
  const emails = reactive<Email[]>([])
  const router = useRouter()

  function create(email: Email) {
    emails.unshift(email)
  }

  function find(id: string): Email | undefined {
    return emails.find(i => i.id === id)
  }

  function markOpenEmail(id: string) {
    // find the email by id, then update isOpen property to true
    const index = emails.findIndex(i => i.id === id)
    if (index === -1) return
    emails[index].isOpen = true
  }

  function destroy(emailId: string) {
    const index = emails.findIndex(i => i.id === emailId)
    emails.splice(index, 1)
  }

  return {
    emails,
    create,
    find,
    destroy,
    markOpenEmail,
  }
})