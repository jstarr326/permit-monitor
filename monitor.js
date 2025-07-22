const puppeteer = require("puppeteer");

async function checkAvailability({ riverName, startDate, endDate }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    const url = "https://www.recreation.gov/permits/234571";
    await page.goto(url, { waitUntil: "networkidle2" });

    const availableDates = await page.evaluate(() => {
      const dates = [];
      const calendarDays = document.querySelectorAll('[aria-label*="available"]');
      calendarDays.forEach(day => {
        const dateStr = day.getAttribute("aria-label");
        if (dateStr) {
          dates.push(dateStr); // e.g., "July 21, 2025 - 5 slots available"
        }
      });
      return dates;
    });

    console.log("✅ Openings found:", availableDates);
    return availableDates;

  } catch (err) {
    console.error("❌ Error checking availability:", err);
    return [];
  } finally {
    await browser.close();
  }
}

// Export a single function that index.js can call
module.exports = async function runBot() {
  return await checkAvailability({
    riverName: "Middle Fork Salmon",
    startDate: "2025-07-15",
    endDate: "2025-07-25",
  });
};
