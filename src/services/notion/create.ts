"use server";
import { removeCommaFromString } from "@/helpers/removeCommaFromString";
import { notion, DATABASE_ID } from "../../config/notion";

interface Payload {
  name: string;
  message: string;
  createdAt: string;
}

interface Answer {
  id: number;
  text: string;
}
export interface PollAnswered {
  answer: Answer[];
  id: number;
  kind: "unique" | "multiple" | "text";
  otherText?: string;
  pollId?: string;
  question?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AVAILABLE_QUESTIONS_ID = [
  "Nome",
  "Número de Telefone",
  "what_help_do_you_need",
  "do_you_read_the_scriptures",
  "how_much_time_do_you_dedicate",
  "do_you_want_tips",
  "how_often_do_you_do_family_night",
  "have_you_studied_come_follow_me",
  "what_are_the_main_motives",
] as const;
export type AvailableQuestions = (typeof AVAILABLE_QUESTIONS_ID)[number];

export type AvailableQuestionsList = {
  [K in AvailableQuestions]: PollAnswered;
};
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

export async function personalCreate(data: AvailableQuestionsList) {
  // const data = JSON.parse(rawData);

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
              content: data.Nome.answer[0].text || "NA",
            },
          },
        ],
      },
      "Número de Telefone": {
        type: "phone_number",
        phone_number: data["Número de Telefone"]?.answer[0]?.text || "NA",
      },
      "Criado em": {
        type: "date",
        date: {
          start: new Date().toISOString(),
        },
      },
      what_help_do_you_need: {
        type: "multi_select",
        multi_select: data.what_help_do_you_need.answer.map((item) => ({
          name: item.text,
        })),
      },
      do_you_read_the_scriptures: {
        type: "select",
        select: {
          name: removeCommaFromString(
            data.do_you_read_the_scriptures.answer[0].text
          ),
        },
      },
      how_much_time_do_you_dedicate: {
        type: "select",
        select: {
          name: data.how_much_time_do_you_dedicate?.answer[0].text || "NA",
        },
      },
      do_you_want_tips: {
        type: "select",
        select: {
          name: removeCommaFromString(data.do_you_want_tips.answer[0].text),
        },
      },
      how_often_do_you_do_family_night: {
        type: "select",
        select: {
          name: data.how_often_do_you_do_family_night.answer[0].text,
        },
      },
      have_you_studied_come_follow_me: {
        type: "select",
        select: {
          name: removeCommaFromString(
            data.have_you_studied_come_follow_me.answer[0].text
          ),
        },
      },
      what_are_the_main_motives: {
        type: "multi_select",
        multi_select: data.what_are_the_main_motives?.answer.map((item) => ({
          name: item.text,
        })) || [{ name: "NA" }],
      },
    },
  });
  console.log(data);
}
