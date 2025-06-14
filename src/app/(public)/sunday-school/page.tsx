"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { POLL_SUNDAY_SCHOOL } from "@/constants/polls/sundaySchool";
import {
  AvailableQuestionsList,
  personalCreate,
  PollAnswered,
} from "@/services/notion/create";
import { toast } from "sonner";

// Define a type for our formatted answers
export type FormattedAnswer = {
  id: number;
  pollId: string;
  question: string;
  kind: "unique" | "multiple";
  answer: number[] | { id: number; text: string }[];
  otherText?: string;
};

export default function SundaySchoolPollPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [otherText, setOtherText] = useState<{ [key: number]: string }>({});
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testQuestions = POLL_SUNDAY_SCHOOL;
  const currentQuestion = testQuestions[currentQuestionIndex];

  // Calculate progress based on current position
  const currentPosition = answeredQuestionIds.includes(currentQuestion.id)
    ? answeredQuestionIds.length
    : answeredQuestionIds.length + 1;

  const progress = Math.round((currentPosition / testQuestions.length) * 100);

  const handleUniqueAnswer = (value: string) => {
    const optionId = parseInt(value);
    const payload = { ...answers, [currentQuestion.id]: [optionId] };
    setAnswers(payload);
  };

  const handleMultipleAnswer = (optionId: number, checked: boolean) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    const newAnswers = checked
      ? [...currentAnswers, optionId]
      : currentAnswers.filter((id) => id !== optionId);

    const payload = { ...answers, [currentQuestion.id]: newAnswers };

    setAnswers(payload);
  };

  const handleOtherAnswer = (value: string) => {
    const payload = { ...otherText, [currentQuestion.id]: value };
    setOtherText(payload);
  };

  const getNextQuestionIndex = (
    currentIndex: number,
    userAnswers: { [key: number]: number[] }
  ) => {
    const question = testQuestions[currentIndex];

    // If the question has conditional logic
    if (question.hasConditional && question.conditionalAnswerMatch) {
      const selectedAnswers = userAnswers[question.id] || [];

      // Go through each conditional match
      for (const [nextQuestionIdStr, triggerAnswerIds] of Object.entries(
        question.conditionalAnswerMatch
      )) {
        const nextQuestionId = parseInt(nextQuestionIdStr);

        // Check if the user selected any of the triggering answers
        const hasMatchingAnswer = selectedAnswers.some((answerId) =>
          triggerAnswerIds.includes(answerId)
        );

        if (hasMatchingAnswer) {
          // Find the index of the next question by its id
          const nextIndex = testQuestions.findIndex(
            (q) => q.id === nextQuestionId
          );
          if (nextIndex !== -1) {
            return nextIndex;
          }
        }
      }
    }

    // Default to the next sequential question
    return currentIndex + 1;
  };

  const formatAnswers = (): AvailableQuestionsList => {
    const formatted: { [key: string]: PollAnswered } = {};
    const hasOtherText = Object.keys(otherText).length > 0;
    if (hasOtherText) {
      Object.entries(otherText).forEach(([questionId, text]) => {
        const question = testQuestions.find(
          (q) => q.id === parseInt(questionId)
        );
        if (!question) return;

        if (!formatted[question.pollId]) {
          formatted[question.pollId] = {
            id: question.id,
            pollId: question.pollId,
            question: question.question,
            kind: question.kind,
            answer: [],
          };
        }

        // Add the other text answer
        formatted[question.pollId].answer.push({
          id: parseInt(questionId),
          text: text,
        });
      });
    }
    // Process each question that has been answered
    Object.entries(answers).forEach(([questionId, answerIds]) => {
      const question = testQuestions.find((q) => q.id === parseInt(questionId));
      if (!question) return;

      // Format answers as objects with id and text for display
      const formattedAnswer = answerIds.map((answerId) => {
        const option = question.options.find((opt) => opt.id === answerId);
        return {
          id: answerId,
          text: option?.text || "Unknown option",
        };
      });

      Object.assign(formatted, {
        [question.pollId]: {
          id: question.id,
          pollId: question.pollId,
          question: question.question,
          kind: question.kind,
          answer: formattedAnswer,
        },
      });
    });

    return formatted as AvailableQuestionsList;
  };

  const handleNext = async () => {
    // Add current question to answered questions
    if (!answeredQuestionIds.includes(currentQuestion.id)) {
      setAnsweredQuestionIds([...answeredQuestionIds, currentQuestion.id]);
    }

    const nextIndex = getNextQuestionIndex(currentQuestionIndex, answers);

    if (nextIndex < testQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      const formatted = formatAnswers();

      // Log the formatted answers to console
      console.log("Poll answers:", formatted);
      await handleSend(formatted);
    }
  };

  const handleSend = async (payload: AvailableQuestionsList) => {
    try {
      setIsLoading(true);
      await personalCreate(payload);
      toast.success("Mensagem enviada com sucesso!", {
        description: "Obrigado por preencher o formulário.",
      });
      setIsComplete(true);
    } catch (error) {
      toast.error("Erro ao enviar a mensagem.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    // Find the previous question that was answered
    const currentId = currentQuestion.id;
    const prevAnsweredId = [...answeredQuestionIds]
      .reverse()
      .find((id) => id !== currentId);

    if (prevAnsweredId) {
      const prevIndex = testQuestions.findIndex((q) => q.id === prevAnsweredId);
      if (prevIndex !== -1) {
        setCurrentQuestionIndex(prevIndex);
      } else if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isAnswered = () => {
    if (currentQuestion.kind === "text") {
      return (
        otherText[currentQuestion.id] &&
        otherText[currentQuestion.id].trim() !== ""
      );
    }
    return (
      answers[currentQuestion.id] && answers[currentQuestion.id].length > 0
    );
  };

  if (isComplete) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" />
              Muito obrigado!
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
            <p className="mb-4">Suas respostas foram salvas.</p>
            <div className="bg-muted p-4 rounded-md overflow-auto">
              <p className="font-medium mb-2">Your answers:</p>
              {formattedAnswers.map((answer) => (
                <div key={answer.id} className="mb-4">
                  <p className="font-medium">{answer.question}</p>
                  <ul className="list-disc pl-5 mt-1">
                    {Array.isArray(answer.answer) &&
                      (typeof answer.answer[0] === "number"
                        ? answer.answer.map((id) => {
                            const question = testQuestions.find(
                              (q) => q.id === answer.id
                            );
                            const option = question?.options.find(
                              (o) => o.id === id
                            );
                            return (
                              <li key={String(id)}>
                                {option?.text || `Option ${id}`}
                              </li>
                            );
                          })
                        : answer.answer.map((opt) =>
                            typeof opt === "object" && opt !== null ? (
                              <li key={opt.id}>{opt.text}</li>
                            ) : null
                          ))}
                    {answer.otherText && <li>Other: {answer.otherText}</li>}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent> */}
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {testQuestions.length}
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <CardTitle className="mt-4">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            switch (currentQuestion.kind) {
              case "unique":
                return (
                  <RadioGroup
                    value={answers[currentQuestion.id]?.[0]?.toString() || ""}
                    onValueChange={handleUniqueAnswer}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent/50"
                      >
                        <RadioGroupItem
                          value={option.id.toString()}
                          id={`option-${option.id}`}
                        />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="w-full cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                );

              case "multiple":
                return (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent/50"
                      >
                        <Checkbox
                          id={`option-${option.id}`}
                          checked={
                            answers[currentQuestion.id]?.includes(option.id) ||
                            false
                          }
                          onCheckedChange={(checked) =>
                            handleMultipleAnswer(option.id, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="w-full cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}

                    {currentQuestion.otherOption && (
                      <div className="border p-3 rounded-md mt-2">
                        <Label htmlFor="other-input" className="mb-1 block">
                          Outro (por favor especifique):
                        </Label>
                        <Input
                          id="other-input"
                          type="text"
                          value={otherText[currentQuestion.id] || ""}
                          onChange={(e) => handleOtherAnswer(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                );

              case "text":
                return (
                  <div className="space-y-3">
                    <Input
                      id="text-input"
                      type="text"
                      value={otherText[currentQuestion.id] || ""}
                      onChange={(e) => handleOtherAnswer(e.target.value)}
                      className="mt-1"
                    />

                    {currentQuestion.pollId === "Nome" && (
                      <Button
                        variant="outline"
                        onClick={() => handleOtherAnswer("Anonymous")}
                      >
                        Send as Anonymous
                      </Button>
                    )}
                  </div>
                );
              default:
                return <p>Unknown question type</p>;
            }
          })()}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 mt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={answeredQuestionIds.length === 0}
            size="sm"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered() || isLoading}
            size="sm"
          >
            {currentQuestionIndex < testQuestions.length - 1 ? (
              <>
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Submit <CheckCircle2 className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
