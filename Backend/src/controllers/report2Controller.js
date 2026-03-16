const prisma = require("../config/db");

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

  return parsed.length
    ? parsed
    : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
}

async function getReport2Comparison(req, res) {
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
    const selectedMonthNumbers = selectedMonths.map((m) => Number(m));

    const minYear = Math.min(gregorianYearA, gregorianYearB);
    const maxYear = Math.max(gregorianYearA, gregorianYearB);

    const startDate = new Date(minYear, 0, 1);
    const endDate = new Date(maxYear, 11, 31, 23, 59, 59, 999);

    const [departments, leads] = await Promise.all([
      prisma.department.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.lead.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          createdAt: true,
          departmentId: true,
        },
      }),
    ]);

    const result = departments.map((dep) => {
      let countA = 0;
      let countB = 0;

      for (const lead of leads) {
        if (lead.departmentId !== dep.id) continue;

        const date = new Date(lead.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (!selectedMonthNumbers.includes(month)) continue;

        if (year === gregorianYearA) countA += 1;
        if (year === gregorianYearB) countB += 1;
      }

      return {
        department: dep.name,
        yearA: countA,
        yearB: countB,
      };
    });

    return res.json({
      yearA,
      yearB,
      months: selectedMonths,
      rows: result,
    });
  } catch (error) {
    console.error("getReport2Departments error:", error);
    return res.status(500).json({
      message: "שגיאת שרת בשליפת נתוני דוח 2",
      error: error.message,
    });
  }
}

module.exports = {
  getReport2Comparison,
};