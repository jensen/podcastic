export const removeHTML = (input: string) => input.replace(/(<([^>]+)>)/gi, "");
export const removeNonBreakingSpace = (input: string) =>
  input.replace(new RegExp(String.fromCharCode(160), "g"), " ");
