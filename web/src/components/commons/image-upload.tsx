"use client";
import { useState } from "react";
import BasicButton from "@/components/commons/button";
import * as actions from "@/actions";

type VerifyResultStatus = "pending" | "true" | "false";

export default function ImageUpload({
  verifyResult,
  setVerifyResult,
  habitId,
  habitName,
}: {
  habitId: number;
  verifyResult: string | null;
  setVerifyResult: React.Dispatch<React.SetStateAction<VerifyResultStatus>>;
  habitName: string;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    console.log("submitting the evidence");
    if (image) {
      // Convert File to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const base64Image = reader.result as string;

        const verifyResult = await actions.verifyByGPT({
          base64Image: base64Image,
          fileName: image.name,
          fileType: image.type,
          habitName: habitName,
        });
        console.log("Result from ChatGPT", verifyResult);

        // Handle the result here
        if (verifyResult === "true") {
          setVerifyResult("true");
        } else {
          setVerifyResult("false");
        }
        // Create habit transaction for that day
        const habitTransaction = await fetch("/api/db/habit/habittransaction", {
          method: "POST",
          body: JSON.stringify({
            habitId: habitId,
            isCompleted: verifyResult === "true",
            imageURL: base64Image,
          }),
        });
        console.log("Create habit transaction in database", habitTransaction);
      };
    } else {
      setError("Please upload an evidence");
    }
  };
  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <div className="text-primary">{error}</div>
      <BasicButton text="Submit" onClick={handleSubmit} />
    </div>
  );
}
