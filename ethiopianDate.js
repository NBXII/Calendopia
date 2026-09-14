/**
 * Astropia Chronology Engine — Ge'ez Solar Alignment Logic
 */

const ETHIOPIAN_MONTHS = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

export function toEthiopianDate(date) {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const isLeap = (gYear % 4 === 0 && gYear % 100 !== 0) || (gYear % 400 === 0);
  const newYearDay = isLeap ? 12 : 11;

  let ethYear = gYear - 8;
  if (gMonth > 9 || (gMonth === 9 && gDay >= newYearDay)) {
    ethYear = gYear - 7;
  }

  const ethNewYearDate = new Date(gYear, 8, newYearDay);
  let dayOffset;

  if (date >= ethNewYearDate) {
    dayOffset = Math.floor((date - ethNewYearDate) / (1000 * 60 * 60 * 24));
  } else {
    const prevEthNewYearDate = new Date(gYear - 1, 8, (gYear - 1) % 4 === 3 ? 12 : 11);
    dayOffset = Math.floor((date - prevEthNewYearDate) / (1000 * 60 * 60 * 24));
  }

  let ethMonth = Math.floor(dayOffset / 30) + 1;
  let ethDay = (dayOffset % 30) + 1;

  if (ethMonth > 13) ethMonth = 13;

  return {
    day: ethDay,
    month: ethMonth,
    monthName: ETHIOPIAN_MONTHS[ethMonth - 1] || "መስከረም",
    year: ethYear,
    formatted: `${ETHIOPIAN_MONTHS[ethMonth - 1]} ${ethDay}, ${ethYear} ዓ.ም`
  };
}

export function toEthiopianTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  
  let ethHours = hours - 6;
  if (ethHours <= 0) ethHours += 12;
  if (ethHours > 12) ethHours -= 12;

  const period = (hours >= 6 && hours < 18) ? "ቀን" : "ማታ";
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${period} ${ethHours}:${formattedMinutes} ከሰዓት`;
}