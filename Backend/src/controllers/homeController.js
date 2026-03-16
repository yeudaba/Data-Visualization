const prisma = require("../config/db");

function calcTrend(current, previous) {
  if (!previous || previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

async function getHomeSummary(req, res) {
  try {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [
      totalLeads,
      newLeads,
      previousMonthLeads,
      totalMeetings,
      todayMeetings,
      futureMeetings,
      canceledMeetings,
      totalSales,
      newSales,
      previousMonthSales,
      leadsThisMonth,
      closedLeads,
      leadsInProgress,
    ] = await Promise.all([
      prisma.lead.count(),

      prisma.lead.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
            lt: startOfNextMonth,
          },
        },
      }),

      prisma.lead.count({
        where: {
          createdAt: {
            gte: startOfPreviousMonth,
            lt: startOfCurrentMonth,
          },
        },
      }),

      prisma.consultation.count(),

      prisma.consultation.count({
        where: {
          meetingDate: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
        },
      }),

      prisma.consultation.count({
        where: {
          meetingDate: {
            gte: startOfTomorrow,
          },
        },
      }),

      prisma.consultation.count({
        where: {
          arrived: false,
        },
      }),

      prisma.consultation.count({
        where: {
          outcome: "נרשם",
        },
      }),

      prisma.consultation.count({
        where: {
          outcome: "נרשם",
          meetingDate: {
            gte: startOfCurrentMonth,
            lt: startOfNextMonth,
          },
        },
      }),

      prisma.consultation.count({
        where: {
          outcome: "נרשם",
          meetingDate: {
            gte: startOfPreviousMonth,
            lt: startOfCurrentMonth,
          },
        },
      }),

      prisma.lead.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
            lt: startOfNextMonth,
          },
        },
      }),

      prisma.lead.count({
        where: {
          status: "CLOSED",
        },
      }),

      prisma.lead.count({
        where: {
          status: "IN_PROGRESS",
        },
      }),
    ]);

    const refunds = 0;
    const conversionRate =
      leadsThisMonth > 0 ? Math.round((newSales / leadsThisMonth) * 100) : 0;

    return res.json({
      totalLeads,
      newLeads,
      leadsInProgress,
      closedLeads,

      totalSales,
      newSales,
      refunds,
      conversionRate,

      totalMeetings,
      todayMeetings,
      futureMeetings,
      canceledMeetings,

      trends: {
        totalLeads: calcTrend(newLeads, previousMonthLeads),
        newLeads: calcTrend(newLeads, previousMonthLeads),
        leadsInProgress: 0,
        closedLeads: 0,

        totalSales: calcTrend(newSales, previousMonthSales),
        newSales: calcTrend(newSales, previousMonthSales),
        refunds: 0,
        conversionRate: 0,

        totalMeetings: 0,
        todayMeetings: 0,
        futureMeetings: 0,
        canceledMeetings: 0,
      },
    });
  } catch (error) {
    console.error("getHomeSummary error:", error);
    return res.status(500).json({
      message: "שגיאת שרת בשליפת סיכום דף הבית",
      error: error.message,
    });
  }
}

module.exports = {
  getHomeSummary,
};