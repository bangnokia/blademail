import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Email } from '../lib/types'

export const useAppStore = defineStore('appStore', () => {
  const emails = reactive<Email[]>([])

  function create(email: Email) {
    emails.push(email)
  }

  function find(id: string): Email | undefined {
    return emails.find(i => i.id === id)
  }

  function markOpenEmail(id: string) {
    // find the email by id, then update isOpen property to true
    const index = emails.findIndex(i => i.id === id)
    emails[index].isOpen = true
  }

  return {
    emails,
    create,
    find,
    markOpenEmail
  }
})