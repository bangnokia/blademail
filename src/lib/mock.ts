import { useAppStore } from "../stores/appStore";
import { Email } from "./types";
import { nanoid } from "nanoid";
import { parseUrls } from "./utils";


export function createFakeEmails(count: number) {
  const appStore = useAppStore();

  while (count > 0) {
    let email: Email = {
      id: nanoid(),
      subject: "Test email " + count,
      from: [
        ['From user', 'from@blademail.test']
      ],
      sender: ['Test user', 'test@blademail.test'],
      to: ['to@blademail.test'],
      cc: ['cc@blademail.test'],
      date: new Date(),
      raw: `
        the raw content
      `.trim(),
      html: `
      <h1>The html content</h1>
      <a href="https://daudau.cc">daudau.cc</a>
      `.trim(),
      text: 'The text content',
      excerpt: `The short description of email`,
      isOpen: false,
      links: parseUrls(`
      <h1>The html content</h1>
      <a href="https://daudau.cc">daudau.cc</a>
      `).map(url => ({ url, status: 'pending' }))
    }

    appStore.create(email)
    count--;
  }
}