"use client";
import BasicButton from "@/components/commons/button";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../assets/logo-name-vertical.svg";
import { useEffect, useState } from "react";
import LoginImage from "../../assets/login-page-img.svg";
import { User } from "@prisma/client";

export default function Login() {
  const { address, isConnected } = useWeb3ModalAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [inputUsername, setInputUsername] = useState("");
  const [loginStage, setLoginStage] = useState("notLoggedIn");

  const checkUserExists = async () => {
    if (address) {
      console.log("address", address);
      // Check if user already exists or not
      const res = await fetch(`/api/db/login/?address=${address}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const result = await res.json();
      console.log("result from checking user by wallet address", result);

      // ถ้ายังไม่่มี user >> ให้ create new user ให้อัตโนมัติ
      if (res.status === 404) {
        setLoginStage("register");
      } else {
        setLoginStage("loggedIn");
        setUserData(result.user);
        // document.cookie = `walletAddress=${address}; path=/; max-age=3600; SameSite=Strict`;
      }
    } else {
      console.log("not logged in");
    }
  };
  const handleInputUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };
  const handleRegister = async () => {
    const res = await fetch("/api/db/login", {
      method: "POST",
      body: JSON.stringify({ address, username: inputUsername }),
    });
    console.log("result from creating new user", res);
    const result = await res.json();
    document.cookie = `walletAddress=${address}; path=/; max-age=3600; SameSite=Strict`;
    setLoginStage("loggedIn");
    setUserData(result.user);
    router.push("/");
  };

  useEffect(() => {
    checkUserExists();
  }, [address]);

  // Return UI
  const notLoggedIn = (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-3xl font-bold text-secondary">Proof of Habit</div>
      <div className="flex flex-col gap-2">
        <div className="text-lg">1. Set a habit</div>
        <div className="text-lg">2. Let friends sponsor your habit</div>
        <div className="text-lg">3. Submit evidence</div>
        <div className="text-lg">4. Failure will trigger you penalty</div>
      </div>
      <Image src={LoginImage} alt="Login Image" width={240} height={240} />
      <w3m-button size="md" label="Sign in with Wallet" />
    </div>
  );
  const register = (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-3xl font-bold text-secondary text-center">
        How Should We Call You?
      </div>
      <input
        className="border-2 border-gray-300 rounded-md p-2"
        type="text"
        value={inputUsername}
        onChange={handleInputUsername}
        placeholder="Your username"
      />
      <BasicButton text="Register" onClick={handleRegister} color="secondary" />
    </div>
  );
  const loggedIn = (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-2xl">Hello! {userData?.username}</div>
      <div className="text-lg">Let&apos;s be a better version of yourself</div>
      <div className="flex flex-col gap-4">
        <BasicButton
          text="Homepage"
          color="secondary"
          onClick={() => router.push("/")}
        />
      </div>
    </div>
  );

  return (
    <main className="flex h-[788px] flex-col items-center justify-center gap-8 p-8">
      <div>
        <Image src={Logo} alt="Logo" width={100} height={100} />
      </div>

      {loginStage === "notLoggedIn"
        ? notLoggedIn
        : loginStage === "register"
        ? register
        : loggedIn}
    </main>
  );
}
