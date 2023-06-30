import { ShortenForm } from "@/components/index";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl text-slate-700 my-4 text-center">
        Paste the URL to be shortened
      </h1>

      <ShortenForm />
    </>
  );
}