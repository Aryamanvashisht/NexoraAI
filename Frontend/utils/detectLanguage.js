const languageMap = {
  html: "html",
  css: "css",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  py: "python",
};

export const detectLanguage = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();
  return languageMap[ext] ?? "plaintext";
};
