document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Ethiopian Clock Header
  setInterval(() => {
    const now = new Date();
    const ethTime = getEthiopianTimeStr(now);
    const ethDate = toEthiopianDate(now);
    document.getElementById('ethiopian-now').innerText = `${ethDate} | ${ethTime}`;
  }, 1000);

  // 2. Sample Upcoming Eclipse Target (e.g., Total Solar Eclipse - August 2, 2027)
  const nextEclipse = {
    title: "Total Solar Eclipse (North Africa & Red Sea)",
    desc: "A spectacular total eclipse crossing North Africa, visible as a major partial eclipse across Ethiopia.",
    date: new Date('2027-08-02T10:00:00Z') // UTC Time
  };

  document.getElementById('eclipse-title').innerText = nextEclipse.title;
  document.getElementById('eclipse-desc').innerText = nextEclipse.desc;

  // Set converted date strings
  document.getElementById('ethiopian-event-time').innerText = 
    `${toEthiopianDate(nextEclipse.date)} at ${getEthiopianTimeStr(nextEclipse.date)}`;
  
  document.getElementById('gregorian-event-time').innerText = 
    nextEclipse.date.toUTCString();

  // Start the countdown timer
  startCountdown(nextEclipse.date);
});