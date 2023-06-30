export default (host: string, alias: string) => {
  return {
    alias,
    shortUrl: `http://${host}/api/${alias}`,
  };
};
