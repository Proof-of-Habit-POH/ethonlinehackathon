"use client";
import * as React from "react";
import Logo from "../../assets/logo-only.svg";
import Image from "next/image";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Header({ userData }: { userData: User }) {
  console.log("user data inside header", userData);
  const router = useRouter();
  return (
    <div className="flex justify-between items-center gap-4 p-4">
      <div>
        <Image src={Logo} alt="Logo" width={50} height={50} />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div className="text-lg">Hey {userData.username}</div>
        <div className="text-sm">Lets get better version of yourself</div>
      </div>
      <div onClick={() => router.push("/habit/create")}>
        <AddCircleIcon fontSize="large" />
      </div>
    </div>
  );
}
