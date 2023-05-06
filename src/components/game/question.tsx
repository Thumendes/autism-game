"use client";

import { Answer, Question } from "@/lib/sheets";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormEvent, forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export interface QuestionHandle {
  question(question: Question): Promise<Answer>;
}

export const Questions = forwardRef<QuestionHandle>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [promise, setPromise] = useState<((value: Answer | PromiseLike<Answer>) => void) | null>(null);

  const chooseAnswer = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const answerText = formData.get("answer");

      const answer = currentQuestion?.answers.find((answer) => answer.label === answerText);

      if (answer) {
        promise?.(answer);

        setOpen(false);
        setCurrentQuestion(null);
        setPromise(null);
      }
    },
    [promise, currentQuestion?.answers]
  );

  useImperativeHandle(ref, () => ({
    question(question: Question) {
      return new Promise<Answer>((resolve) => {
        setCurrentQuestion(question);
        setOpen(true);
        setPromise(() => resolve);
      });
    },
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentQuestion?.question}</DialogTitle>
        </DialogHeader>

        <form onSubmit={chooseAnswer} className="flex flex-col space-y-7">
          <RadioGroup name="answer" className="space-y-3">
            {currentQuestion?.answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={answer.label} id={`answer-${index}`} />
                <Label htmlFor={`answer-${index}`}>{answer.label}</Label>
              </div>
            ))}
          </RadioGroup>

          <DialogFooter>
            <Button type="submit">Continuar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

Questions.displayName = "Questions";
