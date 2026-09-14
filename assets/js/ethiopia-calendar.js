/**
 * Converts a standard Date object into Ethiopian 12-hour local time format
 */
function getEthiopianTimeStr(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // Shift by 6 hours for Ethiopian local clock (12:00 at 6 AM/PM)
  let ethHours = (hours >= 6) ? hours - 6 : hours + 6;
  let period = (hours >= 6 && hours < 18) ? "ቀን (Day)" : "ማታ/ሌሊት (Night)";

  if (ethHours === 0) ethHours = 12;

  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(ethHours)}:${pad(minutes)}:${pad(seconds)} ${period}`;
}

/**
 * Approximate conversion from Gregorian Date to Ethiopian Date
 */
function toEthiopianDate(date) {
  const monthNames = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
    "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
  ];

  let year = date.getFullYear();
  let month = date.getMonth(); // 0-indexed
  let day = date.getDate();

  // Ethiopian New Year is Sept 11 (or Sept 12 in leap years)
  let ethYear = (month > 8 || (month === 8 && day >= 11)) ? year - 7 : year - 8;

  // Simplified month estimation for UI display
  let ethMonthIndex = (month + 3) % 12;
  let ethDay = day; 

  return `${monthNames[ethMonthIndex]} ${ethDay}, ${ethYear} E.C.`;
}