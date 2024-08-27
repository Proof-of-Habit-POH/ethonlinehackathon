import Link from "next/link";
import ProgressBar from "@/components/commons/progress-bar";
import ChipBar from "@/components/commons/chip";
import {
  daysLeftFromNow,
  calculateMaxStreak,
  calculateMoneySaved,
  calculateProgress,
  calculateTodayVerifyResult,
} from "@/utils/";
import { Habit } from "@prisma/client";

interface HabitSummaryProps {
  habit: HabitDetails | Habit;
}
type VerifyResultStatus = "pending" | "true" | "false";

export default function HabitSummaryCard({ habit }: HabitSummaryProps) {
  console.log("inside stat component", habit);
  const timeLeft = daysLeftFromNow(habit.endDate);
  console.log("habit transaction", habit.transactions);
  // Parse dates
  const startDate = new Date(habit.startDate);
  const endDate = new Date(habit.endDate);

  // calculate maximum streaks
  const maxStreak = calculateMaxStreak(habit.transactions || []);

  const amountSaved = calculateMoneySaved(
    habit.transactions || [],
    habit.amountPunishment,
    habit.duration,
    habit.sponsorships || []
  );
  // calculate progress
  const progress = calculateProgress(startDate, habit.duration, endDate);
  // calculate today's verify result
  const todayVerifyResult = calculateTodayVerifyResult(
    habit.transactions || []
  );
  const chipColor =
    todayVerifyResult === "pending"
      ? "secondary"
      : todayVerifyResult === "completed"
      ? "primary"
      : "error";
  console.log("today verify result", todayVerifyResult);

  // Call habit transactions of this habit
  return (
    <div className="w-full p-2 my-2 bg-lightgray rounded-lg shadow-md">
      <Link href={`/habit/${habit.id}`}>
        <div className="flex flex-col gap-2">
          <div>{habit.name}</div>
          <div> {maxStreak} days streak</div>
          <div>
            {amountSaved}/{habit.amountPunishment} USD saved
          </div>
          <div> {timeLeft} days left </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="w-1/3">
            <ChipBar label={todayVerifyResult} color={chipColor} />
          </div>
          <div className="w-2/3">
            <ProgressBar value={progress} />
          </div>
        </div>
      </Link>
    </div>
  );
}
