import { Email, SpamReport } from "./types";
import { cacheDir } from "@tauri-apps/api/path"
import { writeTextFile, createDir } from "@tauri-apps/api/fs";
import { BaseDirectory } from "@tauri-apps/api/fs"
import { Body, getClient, ResponseType } from "@tauri-apps/api/http";

export function makeExcerpt(email: Email) {
  let excerpt = "";

  if (email.html) {
    const text = new DOMParser().parseFromString(email.html, "text/html").body.textContent?.trim();
    excerpt = text ? text.substring(0, 120) : "";
  } else {
    excerpt = email.text.substring(0, 120);
  }

  return excerpt + "...";
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function parseUrls(html: string): string[] {
  const links = [];
  const images = [];
  const regex = /(<a[^>]+href=")([^"]+)("[^>]*>)([^<]*)(<\/a>)/g;
  let match;
  while (match = regex.exec(html)) {
    links.push(match[2]);
  }
  const regex2 = /(<img[^>]+src=")([^"]+)("[^>]*>)/g;
  while (match = regex2.exec(html)) {
    images.push(match[2]);
  }
  return [...new Set(links.concat(images))]
}


export async function ensureEmailFileIsWritten(email: Email): Promise<string> {
  const fileName = `${email.id}.html`;
  const cacheDirPath = await cacheDir();
  const appCacheDir = `${cacheDirPath}/BladeMail`;

  try {
    await createDir("BladeMail", {
      dir: BaseDirectory.Cache
    });
  } catch (e) { }

  try {
    await writeTextFile(`BladeMail/${fileName}`, email.html, {
      dir: BaseDirectory.Cache
    });
  } catch (e) {
  }

  return appCacheDir + "/" + fileName;
}

export async function checkAliveUrl(url: string): Promise<boolean> {
  const client = await getClient();

  try {
    const response = await client.get(url, { timeout: 12, responseType: ResponseType.Text })

    return response.status === 200
  } catch (ex) {
  }

  return false;
}

export async function checkSpam(raw: string) {
  const client = await getClient();
  const response = await client.post<SpamReport>('https://spamcheck.postmarkapp.com/filter', Body.json({ email: raw }), {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    responseType: ResponseType.JSON
  })

  return response.data
}