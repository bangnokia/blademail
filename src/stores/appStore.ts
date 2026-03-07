import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { Email } from '../lib/types'

export type SmtpStatus = 'starting' | 'running' | 'stopping' | 'stopped' | 'error'

const DEFAULT_SMTP_ADDRESS = '127.0.0.1:1025'

function extractAddress(message: string): string | null {
  const match = message.match(/SMTP server (?:started|stopped|is already running) on (.+)\.$/)

  return match?.[1] ?? null
}

export const useAppStore = defineStore('appStore', () => {
  const emails = reactive<Email[]>([])
  const openNewEmail = ref(true)
  const smtpStatus = ref<SmtpStatus>('stopped')
  const smtpMessage = ref('SMTP server is stopped.')
  const smtpAddress = ref(DEFAULT_SMTP_ADDRESS)
  const smtpError = ref('')

  function create(email: Email) {
    emails.unshift(email)
  }

  function setSmtpStarting() {
    smtpStatus.value = 'starting'
    smtpMessage.value = `Starting SMTP server on ${smtpAddress.value}...`
    smtpError.value = ''
  }

  function setSmtpRunning(message: string) {
    smtpStatus.value = 'running'
    smtpMessage.value = message
    smtpError.value = ''

    const address = extractAddress(message)
    if (address) {
      smtpAddress.value = address
    }
  }

  function setSmtpStopping() {
    smtpStatus.value = 'stopping'
    smtpMessage.value = `Stopping SMTP server on ${smtpAddress.value}...`
    smtpError.value = ''
  }

  function setSmtpStopped(message = 'SMTP server is stopped.') {
    smtpStatus.value = 'stopped'
    smtpMessage.value = message
    smtpError.value = ''

    const address = extractAddress(message)
    if (address) {
      smtpAddress.value = address
    }
  }

  function setSmtpError(message: string) {
    smtpStatus.value = 'error'
    smtpMessage.value = message
    smtpError.value = message
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
    openNewEmail,
    smtpStatus,
    smtpMessage,
    smtpAddress,
    smtpError,

    // actions
    create,
    setSmtpStarting,
    setSmtpRunning,
    setSmtpStopping,
    setSmtpStopped,
    setSmtpError,
    find,
    destroy,
    destroyAll,
    markOpenEmail,
  }
})