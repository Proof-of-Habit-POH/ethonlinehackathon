import Link from "next/link";
import ProgressBar from "@/components/commons/progress-bar";
import ChipBar from "@/components/commons/chip";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PaidIcon from "@mui/icons-material/Paid";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

import {
  daysLeftFromNow,
  calculateMaxStreak,
  calculateMoneySaved,
  calculateProgress,
  calculateTodayVerifyResult,
  calculateTotalBet,
} from "@/utils/";
import { Habit, HabitTransaction, Sponsorship } from "@prisma/client";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}

interface HabitWithHabitTransaction extends HabitDetails {
  transactions: HabitTransaction[];
  sponsorships: Sponsorship[];
}

type VerifyResultStatus = "pending" | "completed" | "failed";
interface HabitSummaryProps {
  habit: HabitWithHabitTransaction;
}

export default function HabitSummaryCard({ habit }: HabitSummaryProps) {
  console.log("inside stat component", habit);
  const timeLeft =
    daysLeftFromNow(habit.endDate) > 0 ? daysLeftFromNow(habit.endDate) : 0;
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
  const totalBet = calculateTotalBet(
    habit.amountPunishment,
    habit.duration,
    habit.sponsorships || []
  );

  // calculate progress
  const progress = calculateProgress(startDate, habit.duration, endDate);
  // calculate today's verify result
  const todayVerifyResult: VerifyResultStatus = calculateTodayVerifyResult(
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
    <Link href={`/habit/${habit.id}`}>
      <div className="w-full p-4 my-2 flex flex-col gap-2 bg-gradient-to-r from-[#EED2CB] to-[#F1E8E6] rounded-lg shadow-md">
        <div className="text-lg">{habit.name}</div>
        <div className="flex flex-col gap-2">
          <div className="flex text-sm items-center gap-1">
            <WhatshotIcon fontSize="small" />
            {maxStreak} days streak
          </div>
          <div className="flex text-sm items-center gap-1">
            <PaidIcon fontSize="small" />
            {amountSaved}/{totalBet} USD saved
          </div>
          <div className="flex text-sm items-center gap-1">
            <AccessTimeFilledIcon fontSize="small" />
            {timeLeft} days left
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="w-1/3">
            {habit.status === "ENDED" ||
            new Date(habit.endDate) < new Date() ? (
              <ChipBar label="Completed" color="primary" />
            ) : (
              <ChipBar label={todayVerifyResult} color={chipColor} />
            )}
          </div>
          <div className="w-2/3">
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>
    </Link>
  );
}
