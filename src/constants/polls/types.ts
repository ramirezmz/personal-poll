export type PollOptionType = {
  id: number;
  text: string;
};

export type PollKind = "unique" | "multiple";

export type ConditionalAnswerMatch = {
  [questionId: string]: number[];
};

export type PollQuestionType = {
  id: number;
  pollId: string;
  question: string;
  kind: PollKind;
  options: PollOptionType[];
  hasConditional: boolean;
  conditionalAnswers?: number[];
  conditionalAnswerMatch?: ConditionalAnswerMatch;
  conditionalQuestionId: number | null;
  otherOption: boolean;
};

export type PollSundaySchoolType = PollQuestionType[];
