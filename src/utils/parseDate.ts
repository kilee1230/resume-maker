import { parse, isValid } from "date-fns";

export const parseDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  try {
    const date = parse(dateStr, "MMM yyyy", new Date());
    return isValid(date) ? date : undefined;
  } catch {
    return undefined;
  }
};
