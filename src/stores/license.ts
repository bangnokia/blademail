import { load } from '@tauri-apps/plugin-store'
import { fetch } from '@tauri-apps/plugin-http'

export interface License {
  value: string
}

const store = await load('license.txt')

export async function saveLicense(licenseKey: string): Promise<void> {
  await store.set('license', { value: licenseKey })
}

export async function getLicense(): Promise<string> {
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

    return response.json() as Promise<{ valid: boolean }>
  } catch (ex) {
    console.error(ex)
  }

  return false
}