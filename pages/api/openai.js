import OpenAI from "openai";
import fs from "fs";

const endpointHandler = async (req, res) => {
  const { prompt, fieldNames } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const messages = [
    {
      role: "system",
      content: `
          import React from 'react';
          const MyComponent = () => {
            return (
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold mb-4">Hello World</h1>
                <p className="text-lg mb-4">Welcome to my Next.js component using Tailwind CSS</p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Click Me</button>
              </div>
            );
          };
          export default MyComponent;
      `,
    },
    { role: "user", content: `${prompt}` },
    {
      role: "user",
      content:
        "please MAKE SURE the payment form is secure and along with all its elements, it MUST be safe so users can insert their credentials in each field, it SHOULD give them the assurance that their credentials are SAFE.",
    },
    {
      role: "user",
      content: "please EACH field should have enough spacing from the next field the MINIMUM it can be is 10px.",
    },
    {
      role: "user",
      content:
        "please the fields that are input elements EACH input element MUST HAVE a [type] that closely relates it's placeholder or name. FOR EXAMPLE an input field with a name attribute set to `CVV` should have be number type",
    },
    {
      role: "user",
      content:
        "please create a submit button styled with tailwind css with a width[50%] with and a height[40px]. the BACKGROUND-COLOR of the submit button should be [black] with a color [white] and a border-radius of [5px]. IT MUST BE centered to the middle of the container and IT MUST HAVE a little spacing from the rest of the fields. THE color of the button should have a nice UI that is visible and flows with the rest of the fields. when clicked the button should fire the handleFormComplete function. MAKE SURE e.preventDefault() is used to prevent the default behaviour of the submit button. MAKE SURE the handleFormComplete function is fired onClick of the submit button instead of the form but all the fields should still be placed in a form element.",
    },
    {
      role: "user",
      content:
        "please the PaymentForm component should take a callback function called onFormComplete which is called in the handleFormComplete function when the submit button is clicked",
    },
    {
      role: "user",
      content: `please inside the handleFormComplete function it should collect the forms input fields into an object and pass it into the onFormComplete function when called. the objects key names must be equivalent to this respective keys: amount, ${fieldNames}`,
    },
    {
      role: "user",
      content:
        "please add a validation to MAKE SURE every field is filled before the onFormComplete function is fired else console.log all the missing fields that MUST be filled.",
    },
    {
      role: "user",
      content: "please REMOVE any occurrences of '```jsx` and '```'",
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const generatedText = completion.choices[0].message.content;
    createFileContent(generatedText);
    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

const createFileContent = async (content) => {
  fs.readFile("components/GeneratedComponent.js", "utf8", async (_, data) => {
    // When Empty.
    if (data.length) {
      writeFileContent(content);
    } else {
      await writeFileContent("");
      writeFileContent(content);
    }
  });
};

const writeFileContent = (content) => {
  fs.writeFile("components/GeneratedComponent.js", content, (err) => {
    if (err) {
      console.error("Error writing the file", err);
    } else {
      console.log("File written successfully");
    }
  });
};

export default endpointHandler;
