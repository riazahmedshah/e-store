export const toLowercase = (keyword: string[]) => {
  const normalizedKeywords = keyword.map((kw:string) => kw.trim().toLowerCase());
  return [...new Set(normalizedKeywords)];
}