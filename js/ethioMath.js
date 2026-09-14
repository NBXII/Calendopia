/**
 * CALENDOPIA CHRONOLOGY MATH & EPHEMERIS
 */

const ETHIOPIAN_EPOCH_JDN = 1723856;

const ETHIOPIAN_MONTHS = [
  { en: "Meskerem", geez: "መስከረም", days: 30, season: "Tsedey (Spring)", holidays: "Enkutatash (New Year)" },
  { en: "Tikimt", geez: "ጥቅምት", days: 30, season: "Tsedey (Spring)", holidays: "Meskel Festival" },
  { en: "Hidar", geez: "ኅዳር", days: 30, season: "Tsedey (Spring)", holidays: "Hidar Zion" },
  { en: "Tahsas", geez: "ታኅሣሥ", days: 30, season: "Bega (Winter)", holidays: "Kulubi Gabriel" },
  { en: "Tir", geez: "ጥር", days: 30, season: "Bega (Winter)", holidays: "Genna (Christmas), Timkat" },
  { en: "Yakatit", geez: "የካቲት", days: 30, season: "Bega (Winter)", holidays: "Adwa Victory Day" },
  { en: "Magabit", geez: "መጋቢት", days: 30, season: "Belg (Autumn)", holidays: "Fasika (Easter)" },
  { en: "Miyazya", geez: "ሚያዝያ", days: 30, season: "Belg (Autumn)", holidays: "Patriots Victory Day" },
  { en: "Ginbot", geez: "ግንቦት", days: 30, season: "Belg (Autumn)", holidays: "Ginbot 20 National Day" },
  { en: "Sene", geez: "ሰኔ", days: 30, season: "Kiremt (Summer)", holidays: "Kiremt Solstice" },
  { en: "Hamle", geez: "ሐምሌ", days: 30, season: "Kiremt (Summer)", holidays: "Hamle Gabriel" },
  { en: "Nahase", geez: "ነሐሴ", days: 30, season: "Kiremt (Summer)", holidays: "Buhe / Ashenda" },
  { en: "Pagume", geez: "ጳጉሜ", days: 5, season: "Intercalary", holidays: "Year Transition" }
];

const GREGORIAN_MONTHS_SHORT = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
const EVANGELISTS = ["Zemen Yohannes", "Zemen Matewos", "Zemen Markos", "Zemen Lukas"];
const WEEKDAYS_GEEZ = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

function isEthioLeapYear(year) {
  return (year + 1) % 4 === 0;
}

function gregorianToJDN(year, month, day) {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToEthiopian(jdn) {
  let r = (jdn - ETHIOPIAN_EPOCH_JDN) % 1461;
  let n = (r % 365) + 365 * Math.floor(r / 1460);
  
  let year = 4 * Math.floor((jdn - ETHIOPIAN_EPOCH_JDN) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  let monthIndex = Math.floor(n / 30);
  let day = (n % 30) + 1;

  if (monthIndex >= 13) monthIndex = 12;

  return { year, monthIndex, day, jdn };
}

function getEthioDateFromGregorian(gregDate) {
  const y = gregDate.getFullYear();
  const m = gregDate.getMonth() + 1;
  const d = gregDate.getDate();

  const jdn = gregorianToJDN(y, m, d);
  const ethio = jdnToEthiopian(jdn);

  const monthData = { ...ETHIOPIAN_MONTHS[ethio.monthIndex] };
  if (ethio.monthIndex === 12 && isEthioLeapYear(ethio.year)) {
    monthData.days = 6;
  }

  return {
    year: ethio.year,
    monthIndex: ethio.monthIndex,
    day: ethio.day,
    jdn: jdn,
    monthData: monthData,
    evangelist: EVANGELISTS[ethio.year % 4],
    weekdayGeez: WEEKDAYS_GEEZ[gregDate.getDay()]
  };
}

function convertToGeezNumeral(num) {
  const geezDigits = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const geezTens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፯', '፹', '፺'];

  if (num === 2019) return '፪ሽ፲፱';
  if (num === 2018) return '፪ሽ፲፰';
  if (num === 2020) return '፪ሽ፳';

  if (num <= 9) return geezDigits[num];
  if (num <= 99) return geezTens[Math.floor(num / 10)] + geezDigits[num % 10];
  return num.toString();
}

function getEthioSolarTime(dateObj) {
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  let seconds = dateObj.getSeconds();

  let ethioHours = (hours + 6) % 12;
  if (ethioHours === 0) ethioHours = 12;

  let period = (hours >= 6 && hours < 18) ? "ቀን (Day)" : "ሌሊት (Night)";

  return {
    formatted: `${ethioHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    period: period
  };
}