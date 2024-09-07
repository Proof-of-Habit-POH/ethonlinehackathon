import { Habit, Sponsorship, HabitTransaction } from "@prisma/client";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}
interface HabitWithHabitTransaction extends HabitDetails {
  transactions: HabitTransaction[];
  sponsorships: Sponsorship[];
}
type VerifyResultStatus = "pending" | "completed" | "failed";

function daysLeftFromNow(isoString: any) {
  const targetDate = new Date(isoString);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInTime = targetDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
}

function calculateMaxStreak(transactions: HabitTransaction[]): number {
  if (!transactions || transactions.length === 0) return 0;
  let maxStreak = 1;
  let currentStreak = 1;

  // Sort transactions by date just in case they are not in order
  transactions
    .filter((transaction) => transaction.isCompleted)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Loop through transactions and check for consecutive days
  let prevDate = new Date(transactions[0].date);

  for (let i = 0; i < transactions.length; i++) {
    const currentDate = new Date(transactions[i].date);

    // Calculate the difference in days between the previous date and the current date
    const daysDiff = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If there is a gap of more than 1 day or the habit was not completed, reset the streak
    if (daysDiff > 1 || !transactions[i].isCompleted) {
      currentStreak = 0;
    } else if (daysDiff === 1 && transactions[i].isCompleted) {
      // If the transaction is completed and is the next consecutive day, increment the streak
      currentStreak++;
    }

    // Update max streak if necessary
    maxStreak = Math.max(maxStreak, currentStreak);

    // Update prevDate to currentDate
    prevDate = currentDate;
  }

  return maxStreak;
}
function calculateSponsorshipAmount(sponsorships: Sponsorship[]) {
  const totalSponsorship = sponsorships.reduce(
    (acc, sponsorship) => acc + Number(sponsorship.amount),
    0
  );
  return totalSponsorship;
}
function calculateUserMaxStreak(habitArray: HabitWithHabitTransaction[]) {
  if (!habitArray || habitArray.length === 0) return 0;
  let overallMaxStreak = 0;

  for (const habit of habitArray) {
    const habitMaxStreak = calculateMaxStreak(habit.transactions);
    overallMaxStreak = Math.max(overallMaxStreak, habitMaxStreak);
  }

  return overallMaxStreak;
}

function calculateTotalBet(
  amountPunishment: number,
  duration: number,
  sponsorships: Sponsorship[]
) {
  if (!amountPunishment && !duration && !sponsorships) return 0;

  // Calculate the base bet amount
  const baseBet = Number(amountPunishment) * duration;

  // Calculate the total sponsorship amount
  const totalSponsorship = sponsorships.reduce((sum, sponsorship) => {
    return sum + Number(sponsorship.amount);
  }, 0);

  // Sum up the base bet and total sponsorship
  const totalBet = baseBet + totalSponsorship;

  return Number(totalBet.toFixed(2));
}
function calculateMoneySaved(
  transactions: HabitTransaction[],
  amountPunishment: number,
  duration: number,
  sponsorships: Sponsorship[]
): number {
  // calculate money saved from daily habit completed
  let amount =
    (transactions.filter((transaction) => transaction.isCompleted).length *
      amountPunishment) /
    duration;
  // calculate money saved in case the habit already "ended"
  const maxStreak = calculateMaxStreak(transactions);
  if (maxStreak === duration) {
    if (!sponsorships) {
      amount += calculateSponsorshipAmount(sponsorships);
    }
  }
  return Number(amount.toFixed(2));
}
function calculateUserMoneySaved(habitArray: HabitWithHabitTransaction[]) {
  if (!habitArray || habitArray.length === 0) return 0;

  let totalMoneySaved = 0;

  for (const habit of habitArray) {
    const habitMoneySaved = calculateMoneySaved(
      habit.transactions,
      habit.amountPunishment,
      habit.duration,
      habit.sponsorships
    );
    totalMoneySaved += habitMoneySaved;
  }

  return Number(totalMoneySaved.toFixed(2));
}
function calculateProgress(startDate: Date, duration: number, endDate: Date) {
  const currentDate = new Date();
  if (currentDate > endDate) return 100;
  const daysPassed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress = (daysPassed / duration) * 100;
  return progress;
}
function calculateUserProgress(habitArray: HabitWithHabitTransaction[]) {
  // total days success / total durations of all habits
  if (!habitArray || habitArray.length === 0) return 0;

  let totalCompletedDays = 0;
  let totalDuration = 0;

  for (const habit of habitArray) {
    const completedDays = habit.transactions.filter(
      (transaction) => transaction.isCompleted
    ).length;
    totalCompletedDays += completedDays;
    totalDuration += habit.duration;
  }

  const progress = (totalCompletedDays / totalDuration) * 100;
  return Math.ceil(progress);
}
function calculateTodayVerifyResult(
  transactions: HabitTransaction[]
): VerifyResultStatus {
  const today = new Date();
  const todayHabitTransaction = transactions.find((habitTransaction) => {
    const habitTransactionDate = new Date(habitTransaction.date);
    return habitTransactionDate.toDateString() === today.toDateString();
  });
  /// 3 cases
  if (todayHabitTransaction) {
    if (todayHabitTransaction?.isCompleted) return "completed";
    else return "failed";
  }
  return "pending";
}

export {
  daysLeftFromNow,
  calculateMaxStreak,
  calculateMoneySaved,
  calculateProgress,
  calculateTodayVerifyResult,
  calculateUserMaxStreak,
  calculateUserMoneySaved,
  calculateUserProgress,
  calculateTotalBet,
};
