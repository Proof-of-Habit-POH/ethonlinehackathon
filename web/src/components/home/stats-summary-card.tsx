import GaugeBar from "@/components/commons/gauge-bar";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SavingsIcon from "@mui/icons-material/Savings";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Habit, HabitTransaction, Sponsorship } from "@prisma/client";
import {
  calculateUserMaxStreak,
  calculateUserMoneySaved,
  calculateUserProgress,
} from "@/utils";
interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}

interface HabitWithHabitTransaction extends HabitDetails {
  transactions: HabitTransaction[];
  sponsorships: Sponsorship[];
}

export default function StatSummaryCard({
  habitArray,
}: {
  habitArray: HabitWithHabitTransaction[];
}) {
  console.log("habit array inside stats component", habitArray);
  const totalMaxStreak = calculateUserMaxStreak(habitArray);
  const totalMoneySaved = calculateUserMoneySaved(habitArray);
  const totalProgress = calculateUserProgress(habitArray);

  return (
    <div className="flex item-start p-4 gap-2">
      <div className="flex flex-col items-center w-1/3 rounded-lg">
        <div className="text-4xl font-bold">{totalMaxStreak} </div>
        <div className="text-sm text-center">Days of Max Streaks</div>
      </div>
      <div className="border-r border-black"></div>
      <div className="flex flex-col items-center w-1/3 rounded-lg">
        <div className="text-4xl font-bold">{totalProgress} </div>
        <div className="text-sm text-center">% of habits completed</div>
      </div>
      <div className="border-r border-black"></div>
      <div className="flex flex-col items-center w-1/3 rounded-lg">
        <div className="text-4xl font-bold">{totalMoneySaved}</div>
        <div className="text-sm text-center">USD Earned</div>
      </div>
    </div>
  );
}
