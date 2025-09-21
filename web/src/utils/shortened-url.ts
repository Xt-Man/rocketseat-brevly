import { FRONTEND_URL } from "./constants";

export function getShortenedUrl(shortened: string) {
  return `${FRONTEND_URL}/${shortened}`;
}