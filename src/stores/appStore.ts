import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Email } from '../lib/types'

export const useAppStore = defineStore('appStore', () => {
  const emails = reactive<Email[]>([])

  function create(email: Email) {
    emails.push(email)
  }

  function find(id: string): Email {
    return emails.find(i => i.id === id)
  }

  return {
    emails,
    create,
    find
  }
})