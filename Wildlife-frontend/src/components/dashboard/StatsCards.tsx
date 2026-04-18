import { motion } from "framer-motion";
import { Trees, PawPrint, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

interface StatsCardsProps {
  stats: {
    totalActivities: number;
    totalLocations: number;
    totalSpecies: number;
    totalParticipants: number;
  };
}

const cards = [
  {
    key: "totalActivities",
    label: "Total Activities",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
    gradient: "blue",
  },
  {
    key: "totalLocations",
    label: "Protected Areas",
    icon: Trees,
    color: "from-emerald-500 to-teal-500",
    gradient: "green",
  },
  {
    key: "totalSpecies",
    label: "Species Tracked",
    icon: PawPrint,
    color: "from-orange-500 to-amber-500",
    gradient: "orange",
  },
  {
    key: "totalParticipants",
    label: "Organizations",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    gradient: "purple",
  },
];

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const value = stats[card.key as keyof typeof stats] || 0;
        const Icon = card.icon;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </p>
                    <motion.p
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="text-3xl font-bold"
                    >
                      {value.toLocaleString()}
                    </motion.p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                      card.gradient === "blue" &&
                        "from-blue-500/20 to-cyan-500/20",
                      card.gradient === "green" &&
                        "from-emerald-500/20 to-teal-500/20",
                      card.gradient === "orange" &&
                        "from-orange-500/20 to-amber-500/20",
                      card.gradient === "purple" &&
                        "from-purple-500/20 to-pink-500/20",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        card.gradient === "blue" && "text-blue-500",
                        card.gradient === "green" && "text-emerald-500",
                        card.gradient === "orange" && "text-orange-500",
                        card.gradient === "purple" && "text-purple-500",
                      )}
                    />
                  </div>
                </div>
              </CardContent>

              <div
                className={cn(
                  "absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:h-1.5",
                  card.gradient === "blue" &&
                    "bg-linear-to-r from-blue-500 to-cyan-500",
                  card.gradient === "green" &&
                    "bg-linear-to-r from-emerald-500 to-teal-500",
                  card.gradient === "orange" &&
                    "bg-linear-to-r from-orange-500 to-amber-500",
                  card.gradient === "purple" &&
                    "bg-linear-to-r from-purple-500 to-pink-500",
                )}
                style={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
              />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
