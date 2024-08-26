"use client";
import { useState } from "react";
import BasicButton from "@/components/commons/button";
import * as actions from "@/actions";

export default function ImageUpload({
  verifyResult,
  setVerifyResult,
}: {
  verifyResult: string | null;
  setVerifyResult: (verifyResult: string | null) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setError(null);
    }
  };
  // Not used
  //   const handleSubmit = async () => {
  //     // Here you can add logic to upload the image
  //     if (image) {
  //       console.log("Uploading image:", image);
  //       const imageUrl = await actions.uploadImage(image);
  //       console.log("Image uploaded:", imageUrl);

  //       // Send To OpenAI to verify
  //       const habitName = "Reading";
  //       const habitDetails = "Read 10 pages of a book";
  //       if (!imageUrl) {
  //         setError("Firebase Image Upload Failed, plase try again");
  //         return;
  //       }
  //       const verifyResult = await actions.verifyByAI({
  //         imageUrl,
  //         habitName,
  //         habitDetails,
  //       });
  //       console.log("Result from ChatGPT", verifyResult);
  //       if (verifyResult === "true") {
  //         setVerifyResult("success");
  //       } else {
  //         setVerifyResult("failed");
  //       }
  //     } else {
  //       setError("Please upload an evidence");
  //     }
  //   };

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
          habitName: "Reading",
          habitDetails: "Read 10 pages of a book",
        });
        console.log("Result from ChatGPT", verifyResult);

        // Handle the result here
        if (verifyResult === "true") {
          setVerifyResult("success");
        } else {
          setVerifyResult("failed");
        }
        // Create habit transaction for that day
        const habitTransaction = await fetch("/api/db/habit/habittransaction", {
          method: "POST",
          body: JSON.stringify({
            habitId: 1,
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
