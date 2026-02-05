export const createSku = (name:string, size: "S" | "M" | "L" | "XL" | "XXL" | "XXXL") => {
  const part1 = name.split(" ").map((word) => word[0]?.toUpperCase()).join("");
  return `${part1} ${size}`.trim().replace(/ /g, '-')
}