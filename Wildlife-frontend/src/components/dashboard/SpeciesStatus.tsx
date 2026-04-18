import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  PawPrint,
  TrendingDown,
  AlertTriangle,
  type LucideProps,
} from "lucide-react";

interface SpeciesStatusProps {
  speciesByStatus: Array<{ status: string; count: number }>;
  totalSpecies: number;
}

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }
> = {
  CRITICALLY_ENDANGERED: {
    label: "Critically Endangered",
    color: "#ef4444",
    icon: AlertTriangle,
  },
  ENDANGERED: { label: "Endangered", color: "#f97316", icon: TrendingDown },
  VULNERABLE: { label: "Vulnerable", color: "#eab308", icon: AlertTriangle },
  NEAR_THREATENED: {
    label: "Near Threatened",
    color: "#84cc16",
    icon: TrendingDown,
  },
  LEAST_CONCERN: {
    label: "Least Concern",
    color: "#22c55e",
    icon: TrendingDown,
  },
  DATA_DEFICIENT: { label: "Data Deficient", color: "#6b7280", icon: PawPrint },
};

export const SpeciesStatus = ({
  speciesByStatus,
  totalSpecies,
}: SpeciesStatusProps) => {
  const endangeredCount =
    speciesByStatus.find((s) => s.status === "ENDANGERED")?.count || 0;
  const criticallyEndangeredCount =
    speciesByStatus.find((s) => s.status === "CRITICALLY_ENDANGERED")?.count ||
    0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <Card className="border-border/50 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            Species Conservation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(endangeredCount > 0 || criticallyEndangeredCount > 0) && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Conservation Alert</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {criticallyEndangeredCount} critically endangered +{" "}
                {endangeredCount} endangered species need immediate attention
              </p>
            </div>
          )}

          <div className="space-y-3">
            {speciesByStatus.map((item, index) => {
              const config = statusConfig[item.status];
              if (!config) return null;
              const percentage = (item.count / totalSpecies) * 100;
              const Icon = config.icon;

              return (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: config.color }}
                      />
                      <span>{config.label}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2"
                    style={{
                      backgroundColor: `${config.color}20`,
                    }}
                    indicatorStyle={{ backgroundColor: config.color }}
                  />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
