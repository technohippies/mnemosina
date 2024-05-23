import OpenAI from "openai";

interface OpenAIRequestParams {
  model: string;
  messages: { role: string; content: string }[];
}

export const fetchFromOpenAI = async ({
  model,
  messages,
}: OpenAIRequestParams) => {
  const requestBody = {
    request_body: {
      model: model,
      messages: messages,
    },
  };

  console.log("Sending request to OpenAI with body:", JSON.stringify(requestBody));

  try {
    const response = await fetch(`https://openaichat.tht3ch.workers.dev/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response received. Status:", response.status);

    const responseBody = await response.json();

    console.log("Response Body:", JSON.stringify(responseBody));

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    if (responseBody.choices && responseBody.choices.length > 0 && responseBody.choices[0].message.content) {
      return { success: true, data: responseBody.choices[0].message.content };
    } else {
      console.log("No completion choices received from OpenAI.");
      return { success: false, error: "No completion choices received from OpenAI." };
    }
  } catch (error) {
    console.error('Error fetching from OpenAI:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};