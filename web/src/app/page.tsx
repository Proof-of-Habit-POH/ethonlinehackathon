"use client";
import Image from "next/image";
import { Backdrop, CircularProgress } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import HabitSummaryCard from "@/components/home/habit-summary-card";
import StatSummaryCard from "@/components/home/stats-summary-card";
import { Habit } from "@prisma/client";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import Header from "@/components/home/header";
import { redirect } from "next/navigation";
import { User, HabitTransaction, Sponsorship } from "@prisma/client";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}

interface HabitWithHabitTransaction extends HabitDetails {
  transactions: HabitTransaction[];
  sponsorships: Sponsorship[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Menu Tab Related functions
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const { address, isConnected } = useWeb3ModalAccount();
  const [habitArray, setHabitArray] = useState<HabitWithHabitTransaction[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Fetch User Data from wallet address
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
  const getHabitArray = async () => {
    const res = await fetch(
      `/api/db/habit/habitandhabittransaction?walletAddress=${address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    if (result.length > 0) {
      setHabitArray(result);
    }
  };

  useEffect(() => {
    if (address) {
      // Save wallet address to cookie
      // document.cookie = `walletAddress=${address}; path=/; max-age=3600; SameSite=Strict`;
      Promise.all([getUserData(), getHabitArray()]).then(() => {
        setLoading(false);
      });
    } else {
      redirect("/login");
    }
  }, [address]);

  // Prepare UI

  const ongoingHabits = (
    <div className="w-full">
      {habitArray
        .filter(
          (habit) =>
            habit.status !== "ENDED" && new Date(habit.endDate) > new Date()
        )
        .sort(
          (a, b) =>
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        )
        .map((habit, index) => {
          return <HabitSummaryCard key={index} habit={habit} />;
        })}
    </div>
  );
  const endedHabits = (
    <div className="w-full">
      {habitArray
        .filter(
          (habit) =>
            habit.status === "ENDED" || new Date(habit.endDate) < new Date()
        )
        .sort(
          (a, b) =>
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        )
        .map((habit, index) => {
          return <HabitSummaryCard key={index} habit={habit} />;
        })}
    </div>
  );

  return (
    <main className="flex w-full min-h-[600px] border flex-col">
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Header userData={userData} />
          <div className="flex w-full p-4 flex-col gap-4 items-center justify-start">
            <div className="w-full bg-gradient-to-b from-[#F55951] to-[#EED2CB] rounded-lg">
              <StatSummaryCard habitArray={habitArray} />
            </div>

            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Active Habits" {...a11yProps(0)} />
                  <Tab label="Past Habits" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div className="w-full">{ongoingHabits}</div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className="w-full">{endedHabits}</div>
              </CustomTabPanel>
            </Box>
          </div>
        </>
      )}
    </main>
  );
}
