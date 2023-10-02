import { useAppStore } from "../stores/appStore";
import { Email } from "./types";
import { nanoid } from "nanoid";


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
      `.trim(),
      text: 'The text content',
      excerpt: `The short description of email`,
      isOpen: false,
      links: []
    }

    appStore.create(email)
    count--;
  }
}