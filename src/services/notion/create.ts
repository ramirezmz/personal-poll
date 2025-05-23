"use server";
import { notion, DATABASE_ID } from "../../config/notion";

interface Payload {
  name: string;
  message: string;
  createdAt: string;
}

export async function create(data: Payload) {
  await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: DATABASE_ID as string,
    },
    properties: {
      Nome: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: data.name,
            },
          },
        ],
      },
      Mensagem: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: data.message,
            },
          },
        ],
      },
      "Criado em": {
        type: "date",
        date: {
          start: data.createdAt,
        },
      },
    },
  });
  console.log(data);
}
