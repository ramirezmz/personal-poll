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

export default function SundaySchoolPollPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [otherText, setOtherText] = useState<{ [key: number]: string }>({});
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>([]);

  const testQuestions = POLL_SUNDAY_SCHOOL;
  const currentQuestion = testQuestions[currentQuestionIndex];
  const progress = Math.round(
    ((answeredQuestionIds.length + 1) / testQuestions.length) * 100
  );

  const handleUniqueAnswer = (value: string) => {
    const optionId = parseInt(value);
    setAnswers({ ...answers, [currentQuestion.id]: [optionId] });
  };

  const handleMultipleAnswer = (optionId: number, checked: boolean) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    const newAnswers = checked
      ? [...currentAnswers, optionId]
      : currentAnswers.filter((id) => id !== optionId);

    setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
  };

  const handleOtherAnswer = (value: string) => {
    setOtherText({ ...otherText, [currentQuestion.id]: value });
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

  const handleNext = () => {
    // Add current question to answered questions
    if (!answeredQuestionIds.includes(currentQuestion.id)) {
      setAnsweredQuestionIds([...answeredQuestionIds, currentQuestion.id]);
    }

    const nextIndex = getNextQuestionIndex(currentQuestionIndex, answers);

    if (nextIndex < testQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setIsComplete(true);
      console.log("data: ", answers);
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
          <CardContent>
            <p className="mb-4">Suas respostas foram salvas.</p>
            <div className="bg-muted p-4 rounded-md overflow-auto">
              <p className="font-medium mb-2">Your answers:</p>
              {Object.entries(answers).map(([questionId, answerIds]) => {
                const question = testQuestions.find(
                  (q) => q.id === parseInt(questionId)
                );
                if (!question) return null;

                return (
                  <div key={questionId} className="mb-4">
                    <p className="font-medium">{question.question}</p>
                    <ul className="list-disc pl-5 mt-1">
                      {answerIds.map((answerId) => {
                        const option = question.options.find(
                          (o) => o.id === answerId
                        );
                        return <li key={answerId}>{option?.text}</li>;
                      })}
                      {question.otherOption && otherText[question.id] && (
                        <li>Other: {otherText[question.id]}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
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
                Pergunta {answeredQuestionIds.length + 1} de{" "}
                {testQuestions.length}
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <CardTitle className="mt-4">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.kind === "unique" ? (
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
          ) : (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent/50"
                >
                  <Checkbox
                    id={`option-${option.id}`}
                    checked={
                      answers[currentQuestion.id]?.includes(option.id) || false
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
                    Other (please specify):
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
          )}
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
          <Button onClick={handleNext} disabled={!isAnswered()} size="sm">
            {currentQuestionIndex < testQuestions.length - 1 ? (
              <>
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Enviar <CheckCircle2 className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
