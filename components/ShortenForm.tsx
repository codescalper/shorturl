import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";

async function createUrl(url: string, alias: string | undefined) {
  const res = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    body: JSON.stringify({ url, alias }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data!");
  }

  return res.json();
}

export default function ShortenForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [alias, setAlias] = useState<string | undefined>();

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (inputUrl) {
      try {
        // create short URL
        const { data, statusCode, error: errorMessage } = await createUrl(inputUrl, alias);
  
        if (statusCode === 200) {
          // redirect user to success page with the code
          router.push(`/success?code=${data.code}`);
          setError(null);
        } else {
          setError(errorMessage);
        }
      } catch (error: any) {
        setError(error.message as string);
      }
    }
  };
  
  const handleOnChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleOnChangeAlias = (e: ChangeEvent<HTMLInputElement>) => {
    setAlias(e.target.value);
  };

  return (
    <form
      className="max-w-[600px] w-full flex justify-center my-4 mx-auto"
      onSubmit={handleOnSubmit}
    >
      <div className="flex flex-col w-full relative">
        <input
          type="text"
          placeholder="Enter a URL"
          className={`border border-solid p-4 rounded-l-lg w-full ${
            error ? "border-rose-600" : ""
          }`}
          onChange={handleOnChangeUrl}
          required
        />

        <input
          type="text"
          placeholder="Enter an alias"
          className="border border-solid p-4 rounded-b-lg w-full mt-2"
          onChange={handleOnChangeAlias}
        />

        {error && (
          <div className="text-xs text-pink-600 mt-2">{error}</div>
        )}
      </div>

      <input
        type="submit"
        className="bg-sky-700 font-bold text-white p-4 rounded-r-lg cursor-pointer"
        value="Shorten URL"
      />
    </form>
  );
}
