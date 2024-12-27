import { Email, SpamReport } from "./types";
import { cacheDir } from "@tauri-apps/api/path"
import { writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs"
import { fetch } from "@tauri-apps/plugin-http";

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
    await mkdir("BladeMail", {
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
  try {
    const response = await fetch(url, { connectTimeout: 5000 });

    return response.ok;
  } catch (ex) {
  }

  return false;
}

export async function checkSpam(raw: string) {
  const response = await fetch(
    'https://spamcheck.postmarkapp.com/filter',
    {
      body: JSON.stringify({ email: raw }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },

    })

    return response.json() as Promise<SpamReport>;
}