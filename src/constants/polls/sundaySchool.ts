import { PollSundaySchoolType } from "@/constants/polls/types";

export const POLL_SUNDAY_SCHOOL: PollSundaySchoolType = [
  {
    id: 1,
    pollId: "do_you_read_the_scriptures",
    question: "Você tem lido as escrituras ultimamente?",
    kind: "unique",
    options: [
      {
        id: 1,
        text: "Sim, todos os dias",
      },
      {
        id: 2,
        text: "Sim, algumas vezes por semana",
      },
      {
        id: 3,
        text: "Sim, algumas vezes por mês",
      },
      {
        id: 4,
        text: "Não, não tenho lido",
      },
    ],
    hasConditional: true,
    conditionalAnswerMatch: {
      2: [1, 2],
      3: [3, 4],
    },
    conditionalQuestionId: 2,
    otherOption: false,
  },
  {
    id: 2,
    pollId: "how_much_time_do_you_dedicate",
    question: "quanto tempo você costuma dedicar por dia?",
    kind: "unique",
    options: [
      {
        id: 1,
        text: "Menos de 5 minutos",
      },
      {
        id: 2,
        text: "Entre 5 e 10 minutos",
      },
      {
        id: 3,
        text: "Entre 10 e 20 minutos",
      },
      {
        id: 4,
        text: "Mais de 20 minutos",
      },
    ],
    hasConditional: true,
    conditionalAnswerMatch: {
      4: [1, 2, 3, 4],
    },
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 3,
    question: "Quais são os principais motivos?",
    pollId: "what_are_the_main_motives",
    kind: "multiple",
    options: [
      {
        id: 1,
        text: "Falta de tempo",
      },
      {
        id: 2,
        text: "Cansaco ou rotina puxada",
      },
      {
        id: 3,
        text: "Não lembro de fazer",
      },
      {
        id: 4,
        text: "Não sinto motivação",
      },
      {
        id: 5,
        text: "Não entendo o que leio",
      },
      {
        id: 6,
        text: "Não tenho costume de estudar sozinho(a)",
      },
    ],
    hasConditional: false,
    conditionalAnswers: [],
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 4,
    question: "Você tem feito o estudo do Vem, e Segue-Me com a família?",
    pollId: "have_you_studied_come_follow_me",
    kind: "unique",
    options: [
      {
        id: 1,
        text: "Sim, toda semana",
      },
      {
        id: 2,
        text: "Sim, de vez em quando",
      },
      {
        id: 3,
        text: "Raramente",
      },
      {
        id: 4,
        text: "Não temos feito",
      },
    ],
    hasConditional: false,
    conditionalAnswers: [],
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 5,
    question: "Com que frequência vocês fazem a noite familiar?",
    pollId: "how_often_do_you_do_family_night",
    kind: "unique",
    options: [
      {
        id: 1,
        text: "Toda semana",
      },
      {
        id: 2,
        text: "Uma ou duas vezes por mês",
      },
      {
        id: 3,
        text: "Quase nunca",
      },
      {
        id: 4,
        text: "Não fazemos",
      },
    ],
    hasConditional: false,
    conditionalAnswers: [],
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 6,
    question:
      "Que tipo de ajuda ou apoio seria útil para melhorar o estudo das escrituras em casa?",
    pollId: "what_help_do_you_need",
    kind: "multiple",
    options: [
      {
        id: 1,
        text: "Sugestões simples de como estudar",
      },
      {
        id: 2,
        text: "Materiais ou lembretes semanais",
      },
      {
        id: 3,
        text: "Ideias para envolver as crianças",
      },
      {
        id: 4,
        text: "Ajuda para organizar a rotina espiritual",
      },
    ],
    hasConditional: false,
    conditionalAnswers: [],
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 7,
    question:
      "Você gostaria de receber dicas e sugestões para o estudo das escrituras por WhatsApp ou impresso?",
    pollId: "do_you_want_tips",
    kind: "unique",
    options: [
      {
        id: 1,
        text: "Sim, por WhatsApp",
      },
      {
        id: 2,
        text: "Sim, impresso",
      },
      {
        id: 3,
        text: "Não, obrigado(a)",
      },
    ],
    hasConditional: true,
    conditionalAnswerMatch: {
      8: [1],
      9: [2, 3],
    },
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 8,
    question: "Qual é o seu número de telefone?",
    pollId: "Número de Telefone",
    kind: "text",
    options: [],
    hasConditional: false,
    conditionalAnswers: [],
    conditionalQuestionId: null,
    otherOption: false,
  },
  {
    id: 9,
    question: "Qual é o seu nome?",
    pollId: "Nome",
    kind: "text",
    options: [],
    hasConditional: false,
    conditionalAnswers: [],
    conditionalQuestionId: null,
    otherOption: false,
  },
];
