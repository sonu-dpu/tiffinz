export function getDateAndTimeString(date: Date | string): string {
  const d = new Date(date);
  return d.toString().slice(0, 24);
}

import { DateTime } from "luxon";

export function getSmartDate(date: Date | string): string {
  const input = DateTime.fromJSDate(new Date(date)).setZone("Asia/Kolkata");
  const now = DateTime.now().setZone("Asia/Kolkata");

  // Today
  if (input.hasSame(now, "day")) {
    const diffInHours = now.diff(input, "hours").hours;

    if (diffInHours < 1) {
      const mins = Math.floor(now.diff(input, "minutes").minutes);
      return mins <= 1 ? "Just now" : `${mins} minutes ago`;
    }

    if (diffInHours < 24) {
      const hrs = Math.floor(diffInHours);
      return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
    }

    return "Today";
  }

  // Yesterday
  if (input.hasSame(now.minus({ days: 1 }), "day")) {
    return "Yesterday";
  }

  // Tomorrow
  if (input.hasSame(now.plus({ days: 1 }), "day")) {
    return "Tomorrow";
  }

  // Fallback
  return input.toFormat("ccc, dd LLL yyyy, hh:mm a");
}
