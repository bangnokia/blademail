import { Email } from "../types";
import { cacheDir } from "@tauri-apps/api/path"
import { writeTextFile, createDir, readDir } from "@tauri-apps/api/fs";
import { BaseDirectory } from "@tauri-apps/api/fs"

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