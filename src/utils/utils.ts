import { Email } from "../store";

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