"use client";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import Header from "@/components/home/header";
import HabitSummaryCard from "@/components/home/habit-summary-card";
import Box from "@mui/material/Box";
import { User } from "@prisma/client";
export default function FriendHabit() {
  const { address, isConnected } = useWeb3ModalAccount();
  const [userData, setUserData] = useState<User | null>(null);
  const [sponsoringHabitArray, setSponsoringHabitArray] = useState<
    HabitWithHabitTransaction[]
  >([]);
  const getUserData = async () => {
    const res = await fetch(`/api/db/login?address=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    if (result.user) {
      setUserData(result.user);
    } else {
    }
  };
  const getSponsoringHabitArray = async () => {
    const res = await fetch(`/api/db/sponsorship?walletAddress=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    console.log("sponsoring habits", result);
    if (result.length > 0) {
      setSponsoringHabitArray(result);
    }
  };

  useEffect(() => {
    if (address) {
      // Save wallet address to cookie
      document.cookie = `walletAddress=${address}; path=/; max-age=3600; SameSite=Strict`;
      getUserData();
      getSponsoringHabitArray();
    }
  }, [address]);
  const sponsoringHabits = (
    <div className="w-full">
      {sponsoringHabitArray.map((habit, index: number) => {
        return <HabitSummaryCard key={index} habit={habit} />;
      })}
    </div>
  );
  return (
    <main className="flex w-full min-h-screen border flex-col">
      <Header userData={userData} />
      <div className="flex w-full p-4 flex-col gap-4 items-center justify-start">
        <div className="flex w-full flex-col gap-2 items-center justify-start">
          <div className="text-3xl font-bold text-secondary">
            Your Friends’ Habits
          </div>
          <div className="text-sm">Sponsor to keep them motivated!</div>
        </div>
        <div className="w-full">{sponsoringHabits}</div>
      </div>
    </main>
  );
}
