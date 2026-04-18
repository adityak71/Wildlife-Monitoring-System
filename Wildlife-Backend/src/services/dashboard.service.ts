import prisma from "../utils/prisma.client";
import logger from "../utils/logger";
import { HTTP_STATUS } from "../utils/constants";

export const getDashboardData = async () => {
  try {
    const [
      totalActivities,
      totalLocations,
      totalSpecies,
      totalParticipants,
      totalUsers,
      activitiesByType,
      activitiesByStatus,
      speciesByConservationStatus,
      recentActivities,
      recentParticipants,
      locationsWithActivity,
    ] = await Promise.all([
      prisma.monitoringActivity.count(),
      prisma.location.count(),
      prisma.species.count(),
      prisma.participant.count(),
      prisma.user.count(),

      prisma.monitoringActivity.groupBy({
        by: ["type"],
        _count: true,
      }),

      prisma.monitoringActivity.groupBy({
        by: ["status"],
        _count: true,
      }),

      prisma.species.groupBy({
        by: ["conservationStatus"],
        _count: true,
      }),

      prisma.monitoringActivity.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          location: {
            select: { id: true, name: true },
          },
          reportedBy: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),

      prisma.participant.findMany({
        take: 5,
        orderBy: { registeredAt: "desc" },
        select: {
          id: true,
          name: true,
          city: true,
          status: true,
          registeredAt: true,
        },
      }),

      prisma.location.findMany({
        select: {
          id: true,
          name: true,
          latitude: true,
          longitude: true,
          _count: {
            select: {
              activities: true,
            },
          },
        },
        where: {
          activities: {
            some: {},
          },
        },
      }),
    ]);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 6);

    const allActivities = await prisma.monitoringActivity.findMany({
      where: {
        date: {
          gte: threeMonthsAgo,
        },
      },
      select: {
        date: true,
        type: true,
      },
    });

    const monthMap: Record<string, number> = {};
    allActivities.forEach((activity) => {
      const monthKey = activity.date.toISOString().slice(0, 7);  
      monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
    });

    const activitiesByMonth = Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        overview: {
          totalActivities,
          totalLocations,
          totalSpecies,
          totalParticipants,
          totalUsers,
        },
        activities: {
          byType: activitiesByType.map((item) => ({
            type: item.type,
            count: item._count,
          })),
          byStatus: activitiesByStatus.map((item) => ({
            status: item.status,
            count: item._count,
          })),
          byMonth: activitiesByMonth,
        },
        species: {
          byConservationStatus: speciesByConservationStatus.map((item) => ({
            status: item.conservationStatus,
            count: item._count,
          })),
        },
        recent: {
          activities: recentActivities,
          participants: recentParticipants,
        },
        mapData: locationsWithActivity.map((loc) => ({
          id: loc.id,
          name: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          activityCount: loc._count.activities,
        })),
      },
    };
  } catch (error) {
    logger.error("Get dashboard data error:", error);
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Error fetching dashboard data",
    };
  }
};

export const getActivityTimeline = async (days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const activities = await prisma.monitoringActivity.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        type: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const grouped: Record<
      string,
      { date: string; total: number; byType: Record<string, number> }
    > = {};

    activities.forEach((activity) => {
      const dateStr = activity.date.toISOString().split("T")[0];
      const type = activity.type;

      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          date: dateStr,
          total: 0,
          byType: {},
        };
      }

      grouped[dateStr].total++;
      grouped[dateStr].byType[type] = (grouped[dateStr].byType[type] || 0) + 1;
    });

    const timeline = Object.values(grouped).map((item) => ({
      date: item.date,
      total: item.total,
      ...item.byType,
    }));

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        timeline,
        days,
        totalActivities: activities.length,
      },
    };
  } catch (error) {
    logger.error("Get activity timeline error:", error);
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Error fetching timeline data",
    };
  }
};
