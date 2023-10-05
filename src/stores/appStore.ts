import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Email } from '../lib/types'

export const useAppStore = defineStore('appStore', () => {
  const emails = reactive<Email[]>([])
  const openNewEmail = ref(true)

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

  function destroyAll() {
    emails.splice(0, emails.length)
  }

  return {
    emails,
    create,
    find,
    destroy,
    destroyAll,
    markOpenEmail,
    openNewEmail,
  }
})