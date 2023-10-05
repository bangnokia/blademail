import { Store } from 'tauri-plugin-store-api'
import { Body, getClient } from '@tauri-apps/api/http'

export interface License {
  value: string
}

const store = new Store('license.txt')

export async function saveLicense(licenseKey: string): Promise<void> {
  await store.set('license', { value: licenseKey })
}

export async function getLicense(): Promise<string> {
  const result = await store.get<License>('license')

  return result ? result.value : ''
}

export async function verify(license: string) {
  const client = await getClient()

  try {
    const response = await client.post<{ is_valid: boolean }>(
      'https://lab.daudau.cc/api/apps/blade-mail/licenses/verify',
      Body.json({ license_key: license }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    return response.data.is_valid
  } catch (ex) {
    console.error(ex)
  }

  return false
}