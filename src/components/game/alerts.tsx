"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, delay } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Alert {
  title: string;
  description: string;
  type: "success" | "fail";
}

export interface AlertHandle {
  alert(alert: Alert): Promise<void>;
}

export const Alerts = forwardRef<AlertHandle>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

  useImperativeHandle(ref, () => ({
    async alert(alert: Alert) {
      setCurrentAlert(alert);
      setOpen(true);

      await delay(2500);

      setOpen(false);
      setCurrentAlert(null);
    },
  }));

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={cn(currentAlert?.type === "success" ? "border-green-500" : "border-red-500")}>
        <AlertDialogHeader>
          <AlertDialogTitle>{currentAlert?.title}</AlertDialogTitle>
          <AlertDialogDescription>{currentAlert?.description}</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
});

Alerts.displayName = "Alerts";
