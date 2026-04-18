import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { dashboardService } from "../services/dashboard.service";
import { StatsCards } from "../components/dashboard/StatsCards";
import { RecentActivities } from "../components/dashboard/RecentActivities";
import { SpeciesStatus } from "../components/dashboard/SpeciesStatus";
import { LocationMap } from "../components/dashboard/LocationMap";
import { RecentParticipants } from "../components/dashboard/RecentParticipants";
import { motion } from "framer-motion";
import { ActivityChart } from "../components/dashboard/ActivityChart";
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboardData,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-destructive">Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = data?.data;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-dlinear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your conservation
            efforts.
          </p>
        </div>
      </motion.div>

      {dashboardData && <StatsCards stats={dashboardData.overview} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {dashboardData && (
            <ActivityChart
              byType={dashboardData.activities.byType}
              byMonth={dashboardData.activities.byMonth}
              byStatus={dashboardData.activities.byStatus}
            />
          )}
        </div>
        <div>
          {dashboardData && (
            <SpeciesStatus
              speciesByStatus={dashboardData.species.byConservationStatus}
              totalSpecies={dashboardData.overview.totalSpecies}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dashboardData && <LocationMap locations={dashboardData.mapData} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardData && (
          <>
            <RecentActivities activities={dashboardData.recent.activities} />
            <RecentParticipants
              participants={dashboardData.recent.participants}
            />
          </>
        )}
      </div>
    </div>
  );
};
