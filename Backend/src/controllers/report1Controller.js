const prisma = require("../config/db");

const monthLabels = {
  "01": "ינו",
  "02": "פבר",
  "03": "מרץ",
  "04": "אפר",
  "05": "מאי",
  "06": "יונ",
  "07": "יול",
  "08": "אוג",
  "09": "ספט",
  "10": "אוק",
  "11": "נוב",
  "12": "דצמ",
};

const yearMap = {
  'תשפ״ב': 2022,
  'תשפ״ג': 2023,
  'תשפ״ד': 2024,
  'תשפ״ה': 2025,
};

function parseMonthsParam(monthsParam) {
  if (!monthsParam || monthsParam === "ALL") {
    return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  }

  const parsed = monthsParam
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b));

  return parsed.length ? parsed : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
}

function buildMonthlyCounts(leads, year) {
  const counts = Array(12).fill(0);

  for (const lead of leads) {
    const date = new Date(lead.createdAt);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      counts[monthIndex] += 1;
    }
  }

  return counts;
}

function buildCumulativeRows(monthlyA, monthlyB, selectedMonths) {
  let cumA = 0;
  let cumB = 0;

  return selectedMonths.map((monthKey) => {
    const index = Number(monthKey) - 1;

    cumA += monthlyA[index];
    cumB += monthlyB[index];

    return {
      monthKey,
      month: monthLabels[monthKey] || monthKey,
      yearA: cumA,
      yearB: cumB,
    };
  });
}

async function getReport1Comparison(req, res) {
  try {
    const {
      yearA = 'תשפ״ד',
      yearB = 'תשפ״ה',
      months = "ALL",
    } = req.query;

    const gregorianYearA = yearMap[yearA];
    const gregorianYearB = yearMap[yearB];

    if (!gregorianYearA || !gregorianYearB) {
      return res.status(400).json({
        message: "שנים לא תקינות",
      });
    }

    const selectedMonths = parseMonthsParam(months);

    const minYear = Math.min(gregorianYearA, gregorianYearB);
    const maxYear = Math.max(gregorianYearA, gregorianYearB);

    const startDate = new Date(minYear, 0, 1);
    const endDate = new Date(maxYear, 11, 31, 23, 59, 59, 999);

    const leads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyA = buildMonthlyCounts(leads, gregorianYearA);
    const monthlyB = buildMonthlyCounts(leads, gregorianYearB);

    const rows = buildCumulativeRows(monthlyA, monthlyB, selectedMonths);

    return res.json({
      yearA,
      yearB,
      months: selectedMonths,
      rows,
    });
  } catch (error) {
    console.error("getReport1Comparison error:", error);
    return res.status(500).json({
      message: "שגיאת שרת בשליפת נתוני דוח 1",
      error: error.message,
    });
  }
}

module.exports = {
  getReport1Comparison,
};