import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { Email } from '../lib/types'

export const useAppStore = defineStore('appStore', () => {
  const emails = reactive<Email[]>([])

  function addEmail(email: Email) {
    emails.push(email)
  }

  return {
    emails,
    addEmail
  }
})