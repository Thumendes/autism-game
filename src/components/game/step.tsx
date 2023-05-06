"use client";

import { cn } from "@/lib/utils";
import { ROLLBACK_POSITION } from "./data";

interface StepProps {
  cell: number;
  active?: boolean;
}

const borders = ["border-cyan-500", "border-fuchsia-500", "border-yellow-500", "border-green-500"];
const bgs = ["bg-cyan-500", "bg-fuchsia-500", "bg-yellow-500", "bg-green-500"];

export function Step({ cell, active }: StepProps) {
  const border = borders[cell % borders.length];
  const bg = bgs[cell % bgs.length];

  return (
    <div className={cn(`w-20 h-20 flex items-center justify-center rounded-xl border-2 shadow-md`, border)}>
      {ROLLBACK_POSITION === cell && <div className="text-4xl">🚑</div>}
      {active && <div className={cn("w-8 h-8 rounded-full shadow-md", bg)} />}
    </div>
  );
}
