interface HabitTransaction {
  id: number;
  date: string; // ISO string format
  isCompleted: boolean;
  imageURL: string | null;
  habitId: number;
}

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
  let maxStreak = 1;
  let currentStreak = 1;
  if (!transactions || transactions.length === 0) return 0;

  // Sort transactions by date just in case they are not in order
  transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (transactions.length === 0) return 0;

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

function calculateMoneySaved(
  transactions: HabitTransaction[],
  amountPunishment: number,
  duration: number
): number {
  const amount =
    (transactions.filter((transaction) => transaction.isCompleted).length *
      amountPunishment) /
    duration;
  console.log("amount", amount);
  return Number(amount.toFixed(2));
}
function calculateProgress(startDate: Date, duration: number) {
  const currentDate = new Date();
  const daysPassed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progress = (daysPassed / duration) * 100;
  return progress;
}
function calculateTodayVerifyResult(transactions: HabitTransaction[]) {
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
};
