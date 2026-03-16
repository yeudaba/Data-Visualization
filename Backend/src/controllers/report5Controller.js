const prisma = require("../config/db");

const yearMap = {
  'תשפ״ב': 2022,
  'תשפ״ג': 2023,
  'תשפ״ד': 2024,
  'תשפ״ה': 2025,
};

const mediaColorMap = {
  LinkedIn: "#A78BFA",
  Instagram: "#A3E635",
  "Google Ads": "#FBBF24",
  Facebook: "#60A5FA",
  Website: "#34D399",
  TikTok: "#FB7185",
  Referral: "#F97316",
  Other: "#94A3B8",
};

const mediaOrder = [
  "LinkedIn",
  "Instagram",
  "Google Ads",
  "Facebook",
  "Website",
  "TikTok",
  "Referral",
  "Other",
];

function normalizeMediaSource(source) {
  if (!source || typeof source !== "string") {
    return "Other";
  }

  const value = source.trim().toLowerCase();

  if (value.includes("linkedin")) return "LinkedIn";
  if (value.includes("instagram")) return "Instagram";
  if (value.includes("google")) return "Google Ads";
  if (value.includes("facebook")) return "Facebook";
  if (value.includes("website") || value.includes("site") || value.includes("web")) return "Website";
  if (value.includes("tiktok")) return "TikTok";
  if (value.includes("referral") || value.includes("friend") || value.includes("word of mouth")) return "Referral";

  return "Other";
}

function isQualifiedLead(status) {
  if (!status || typeof status !== "string") return false;

  const value = status.trim().toLowerCase();

  const qualifiedStatuses = new Set([
    "qualified",
    "in_progress",
    "in progress",
    "contacted",
    "scheduled",
    "meeting_scheduled",
    "meeting scheduled",
    "consultation_scheduled",
    "consultation scheduled",
    "closed_won",
    "closed won",
    "won",
    "enrolled",
    "registered",
    "active",
    "בטיפול",
    "טופל",
    "נקבעה פגישה",
    "הגיע לפגישה",
    "נסגר",
    "נרשם",
    "איכותי",
    "רלוונטי",
  ]);

  return qualifiedStatuses.has(value);
}

function buildCampusWhere(campus) {
  if (campus === "ASHDOD") {
    return { campus: "ASHDOD" };
  }

  if (campus === "BEER_SHEVA") {
    return { campus: "BEER_SHEVA" };
  }

  return {};
}

async function getReport5Media(req, res) {
  try {
    const {
      campus = "ALL",
      year = "תשפ״ה",
    } = req.query;

    const gregorianYear = yearMap[year];
    if (!gregorianYear) {
      return res.status(400).json({
        message: "שנה לא תקינה",
      });
    }

    const startDate = new Date(gregorianYear, 0, 1);
    const endDate = new Date(gregorianYear, 11, 31, 23, 59, 59, 999);

    const leads = await prisma.lead.findMany({
      where: {
        ...buildCampusWhere(campus),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        source: true,
        status: true,
        createdAt: true,
        campus: true,
      },
    });

    const grouped = {};

    for (const mediaName of mediaOrder) {
      grouped[mediaName] = {
        name: mediaName,
        gross: 0,
        qualified: 0,
        color: mediaColorMap[mediaName],
      };
    }

    for (const lead of leads) {
      const mediaName = normalizeMediaSource(lead.source);

      if (!grouped[mediaName]) {
        grouped[mediaName] = {
          name: mediaName,
          gross: 0,
          qualified: 0,
          color: mediaColorMap[mediaName] || "#94A3B8",
        };
      }

      grouped[mediaName].gross += 1;

      if (isQualifiedLead(lead.status)) {
        grouped[mediaName].qualified += 1;
      }
    }

    const result = mediaOrder.map((name) => grouped[name]);

    return res.json(result);
  } catch (error) {
    console.error("getReport5Media error:", error);
    return res.status(500).json({
      message: "שגיאת שרת בשליפת נתוני דוח 5",
      error: error.message,
    });
  }
}

module.exports = {
  getReport5Media,
};