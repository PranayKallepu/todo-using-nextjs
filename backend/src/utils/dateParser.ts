import * as chrono from "chrono-node";

/**
 * Advanced date parser for natural language.
 * Supports:
 *  - today, tomorrow
 *  - next monday, this friday
 *  - in 2 hours, after 3 days
 *  - tonight, this evening
 */
export const parseNaturalDate = (text: string): Date | null => {
  let lower = text.toLowerCase();

  // 1️⃣ Direct chrono parsing (best for dates)
  const chronoDate = chrono.parseDate(text);
  if (chronoDate) return chronoDate;

  // 2️⃣ Today
  if (lower.includes("today")) {
    return new Date();
  }

  // 3️⃣ Tomorrow
  if (lower.includes("tomorrow")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }

  // 4️⃣ Tonight / this evening
  if (lower.includes("tonight") || lower.includes("this evening")) {
    const d = new Date();
    d.setHours(19, 0, 0, 0); // 7 PM default
    return d;
  }

  // 5️⃣ Next week
  if (lower.includes("next week")) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }

  // 6️⃣ Natural ranges: "in 2 hours", "after 3 days"
  const durationMatch = lower.match(/(in|after) (\d+) (minutes|minute|hours|hour|days|day|weeks|week)/);

  if (durationMatch) {
    const amount = parseInt(durationMatch[2]);
    const unit = durationMatch[3];

    const d = new Date();

    switch (unit) {
      case "minute":
      case "minutes":
        d.setMinutes(d.getMinutes() + amount);
        return d;

      case "hour":
      case "hours":
        d.setHours(d.getHours() + amount);
        return d;

      case "day":
      case "days":
        d.setDate(d.getDate() + amount);
        return d;

      case "week":
      case "weeks":
        d.setDate(d.getDate() + amount * 7);
        return d;
    }
  }

  // 7️⃣ "this monday" or "next friday"
  const weekdays = [
    "sunday", "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday"
  ];

  for (let day of weekdays) {
    if (lower.includes(`next ${day}`) || lower.includes(`this ${day}`)) {
      return chrono.parseDate(lower);
    }
  }

  return null;
};
