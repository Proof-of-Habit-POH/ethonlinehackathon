"use client";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import HabitSummaryCard from "@/components/home/habit-summary-card";
import StatSummaryCard from "@/components/home/stats-summary-card";
import * as actions from "@/actions";
import { Habit } from "@prisma/client";
import { redirect } from "next/navigation";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import Header from "@/components/home/header";

interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
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
  const [sponsoringHabitArray, setSponsoringHabitArray] = useState<
    HabitWithHabitTransaction[]
  >([]);
  const [userData, setUserData] = useState<UserWithUserData[]>([]);
  const [value, setValue] = useState(0);

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

  const getSponsoringHabitArray = async () => {
    const res = await fetch(`/api/db/sponsorship?walletAddress=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    if (result.length > 0) {
      setSponsoringHabitArray(result);
    }
  };

  useEffect(() => {
    if (address) {
      // Save wallet address to cookie
      document.cookie = `walletAddress=${address}; path=/; max-age=3600; SameSite=Strict`;
      getUserData();
      getHabitArray();
      getSponsoringHabitArray();
    }
  }, [address]);

  // Prepare UI

  const ongoingHabits = (
    <div className="w-full">
      {habitArray
        .filter((habit) => habit.status !== "ENDED")
        .map((habit, index) => {
          return <HabitSummaryCard key={index} habit={habit} />;
        })}
    </div>
  );
  const endedHabits = (
    <div className="w-full">
      {habitArray
        .filter((habit) => habit.status === "ENDED")
        .map((habit, index) => {
          return <HabitSummaryCard key={index} habit={habit} />;
        })}
    </div>
  );
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
        <div className="w-full bg-primary opacity-50 rounded-lg">
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
              <Tab label="Sponsoring Habits" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="w-full">{ongoingHabits}</div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="w-full">{endedHabits}</div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className="w-full">{sponsoringHabits}</div>
          </CustomTabPanel>
        </Box>
      </div>
    </main>
  );
}
