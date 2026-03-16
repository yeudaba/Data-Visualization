const prisma = require("../config/db");

async function getLeadsByCity(req, res) {
  try {
    const { campus, department, area, year, month } = req.query;

    const leadWhere = {};

    if (campus && campus !== "ALL" && campus !== "undefined") {
      leadWhere.campus = campus;
    }

    if (department && department !== "ALL" && department !== "undefined") {
      leadWhere.department = {
        name: department,
      };
    }

    if (year && year !== "ALL" && year !== "undefined") {
      const yearInt = parseInt(year, 10);

      if (!Number.isNaN(yearInt)) {
        let startDate = null;
        let endDate = null;

        if (month && month !== "ALL" && month !== "undefined") {
          const monthInt = parseInt(month, 10);

          if (!Number.isNaN(monthInt)) {
            startDate = new Date(yearInt, monthInt - 1, 1);
            endDate = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);
          }
        } else {
          startDate = new Date(yearInt, 0, 1);
          endDate = new Date(yearInt, 11, 31, 23, 59, 59, 999);
        }

        if (startDate && endDate) {
          leadWhere.createdAt = {
            gte: startDate,
            lte: endDate,
          };
        }
      }
    }

    const cityWhere = {};
    if (area && area !== "ALL" && area !== "undefined") {
      cityWhere.region = area;
    }

    const cityStats = await prisma.city.findMany({
      where: cityWhere,
      include: {
        leads: {
          where: leadWhere,
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        town: "asc",
      },
    });

    const formatted = cityStats
      .map((city) => ({
        town: city.town,
        count: city.leads.length,
        region: city.region,
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);

    return res.json(formatted);
  } catch (error) {
    console.error("getLeadsByCity error:", error);

    return res.status(500).json({
      message: "שגיאת שרת בשליפת נתוני ערים",
      error: error.message,
    });
  }
}

module.exports = {
  getLeadsByCity,
};