// import { customAlphabet } from "nanoid";

export default (host: string) => {

  const alias = "helloworld";
  return {
    alias,
    shortUrl: `http://${host}/${alias}`,
  };
};