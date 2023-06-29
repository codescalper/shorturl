// import { customAlphabet } from "nanoid";

export default (host: string) => {

  const alias = "mayankonweb";
  return {
    alias,
    shortUrl: `http://${host}/${alias}`,
  };
};