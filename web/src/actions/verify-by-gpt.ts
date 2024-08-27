"use server";

export async function verifyByGPT({
  base64Image,
  habitName,
}: {
  base64Image: string;
  fileName: string;
  fileType: string;
  habitName: string;
}) {
  try {
    // Construct the API payload
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 
`You are an AI assistant tasked with verifying whether an image provides proof of a user completing their stated habit. Follow these steps carefully:

1. First, you will be given a habit statement. This describes what the user is trying to do regularly. The habit statement is:
<habit_statement>
${habitName}
</habit_statement>

2. Next, you will be provided with an image that the user has submitted as proof of completing their habit. You can find an image in the image_url field.
3. Analyze the habit statement:
   - Identify the key action or behavior described in the habit statement.
   - Note any specific details or requirements mentioned.

4. Describe the image:
   - Explain what you see in the image in detail.
   - Focus on elements that might be relevant to the habit statement.

5. Compare the image to the habit statement:
   - Determine if the image provides clear evidence of the user completing the action described in the habit statement.
   - Consider whether all specific requirements of the habit are met based on what's visible in the image.

6. Provide your conclusion:
   - If the image clearly demonstrates completion of the habit as described, output "true".
   - If the image does not provide clear evidence of habit completion, or if there's any doubt, output "false".

your response must only be "true" or "false", with no additional explanation.`,
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    };
    console.log("image ", base64Image);
    console.log("payload", payload);

    // Send the API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse the response
    const data = await response.json();
    console.log(data);

    // Handle the response (e.g., returning the result)
    return data.choices[0]?.message.content;
  } catch (error) {
    console.error("Error verifying by AI:", error);
    throw new Error("Failed to verify image by AI");
  }
}
