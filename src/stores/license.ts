import { load } from '@tauri-apps/plugin-store'
import { fetch } from '@tauri-apps/plugin-http'

export interface License {
  value: string
}

let storePromise: ReturnType<typeof load> | null = null

async function getStore() {
  if (!storePromise) {
    storePromise = load('license.txt')
  }

  return storePromise
}

export async function saveLicense(licenseKey: string): Promise<void> {
  const store = await getStore()

  await store.set('license', { value: licenseKey })
}

export async function getLicense(): Promise<string> {
  const store = await getStore()
  const result = await store.get<License>('license')

  return result ? result.value : ''
}

export async function verify(license: string) {
  try {
    const response = await fetch(
      'https://lab.daudau.cc/api/apps/blade-mail/licenses/verify',
      {
        method: 'POST',
        body: JSON.stringify({ license_key: license }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    const result = await response.json() as { is_valid: boolean }

    return result.is_valid
  } catch (ex) {
    console.error(ex)
  }

  return false
}