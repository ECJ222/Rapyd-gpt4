import { useEffect, useState, useCallback } from "react";
import loadable from "@loadable/component";
import Loader from "./Loader";

const SelectPaymentType = ({ paymentType, moveToNextStep }) => {
  const [isLoading, setIsLoading] = useState("");
  const [content, setContent] = useState("");

  const getResponseFromOpenAI = useCallback(async () => {
    setContent("");
    setIsLoading(true);

    // Extract field names from paymentType.fields
    const fieldNames = paymentType.fields.map((field) => field.name).join(", ");

    // Create a prompt based on the extracted field names
    const prompt = `you are a senior react engineer gpt, create a react.js hook component styled with tailwind css based on these fields, generate only the code, DO NOT wrap the returned code with backticks. ONLY generate the code, DO NOT add any explanatry texts, here are the fields: amount, ${fieldNames}.`;

    try {
      const responses = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          fieldNames,
        }),
      });

      const data = await responses.json();
      setIsLoading(false);

      setContent(data.text);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  }, [paymentType]);

  const handleFormComplete = (fields) => {
    moveToNextStep(fields);
  };

  useEffect(() => {
    if (paymentType.fields && content === "") {
      getResponseFromOpenAI();
    }
  }, [paymentType]);

  return <>{isLoading || !content.trim().length ? <Loader /> : <LoadableComponent onFormComplete={handleFormComplete} />}</>;
};
export default SelectPaymentType;

const LoadableComponent = loadable(() => import("./GeneratedComponent"), {
  fallback: <div>Page is Loading...</div>,
});
