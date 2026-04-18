/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  PawPrint,
} from "lucide-react";
import { activityService, type Activity } from "../services/activity.service";
import { locationService, type Location } from "../services/location.service";
import { speciesService, type Species } from "../services/species.service";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { ListSkeleton } from "../components/skeletons/ListSkeleton";
import toast from "react-hot-toast";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  VERIFIED: "bg-green-500/10 text-green-500 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
};

const typeIcons: Record<string, string> = {
  PATROL: "🚓",
  WILDLIFE_SIGHTING: "🐅",
  ILLEGAL_ACTIVITY: "⚠️",
  FOREST_FIRE: "🔥",
  RESCUE_OPERATION: "🆘",
  RESEARCH_SURVEY: "📊",
  AWARENESS_PROGRAM: "📢",
};

const typeLabels: Record<string, string> = {
  PATROL: "Patrol",
  WILDLIFE_SIGHTING: "Wildlife Sighting",
  ILLEGAL_ACTIVITY: "Illegal Activity",
  FOREST_FIRE: "Forest Fire",
  RESCUE_OPERATION: "Rescue Operation",
  RESEARCH_SURVEY: "Research Survey",
  AWARENESS_PROGRAM: "Awareness Program",
};

export const Activities = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  const { data: locationsData } = useQuery({
    queryKey: ["locations", "all"],
    queryFn: () => locationService.getAll({ limit: 100 }),
  });

  const { data: speciesData } = useQuery({
    queryKey: ["species", "all"],
    queryFn: () => speciesService.getAll({ limit: 100 }),
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "activities",
      page,
      search,
      statusFilter,
      typeFilter,
      locationFilter,
      speciesFilter,
    ],
    queryFn: () =>
      activityService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        type: typeFilter === "all" ? undefined : typeFilter,
        locationId: locationFilter === "all" ? undefined : locationFilter,
        speciesId: speciesFilter === "all" ? undefined : speciesFilter,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: activityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Activity deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedActivity(null);
    },
    onError: () => {
      toast.error("Failed to delete activity");
    },
  });

  const activities = data?.data?.activities || [];
  const pagination = data?.data?.pagination;
  const locations = locationsData?.data?.locations || [];
  const species = speciesData?.data?.species || [];

  const handleDelete = () => {
    if (selectedActivity) {
      deleteMutation.mutate(selectedActivity.id);
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setLocationFilter("all");
    setSpeciesFilter("all");
    setPage(1);
  };

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    locationFilter !== "all" ||
    speciesFilter !== "all";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor forest and wildlife conservation activities
          </p>
        </div>
        <Button className="gap-2 hover:bg-primary/80 transition-all duration-200">
          <Link
            to="/activities/create"
            className="flex items-center justify-center gap-x-1 "
          >
            <Plus className="h-4 w-4" />
            Report Activity
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </Label>
                    <Select
                      value={locationFilter}
                      onValueChange={(value) =>
                        setLocationFilter(value || "all")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent className={"w-full p-3"}>
                        <SelectItem value="all">🌍 All Locations</SelectItem>
                        {locations.map((loc: Location) => (
                          <SelectItem
                            key={loc.id}
                            value={loc.id}
                            className={"mt-2"}
                          >
                            📍 {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-1">
                      <PawPrint className="h-3.5 w-3.5" />
                      Species
                    </Label>
                    <Select
                      value={speciesFilter}
                      onValueChange={(value) =>
                        setSpeciesFilter(value || "all")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Species" />
                      </SelectTrigger>
                      <SelectContent className={"w-full p-3"}>
                        <SelectItem value="all">🐾 All Species</SelectItem>
                        {species.map((sp: Species) => (
                          <SelectItem
                            key={sp.id}
                            value={sp.id}
                            className={"mt-2"}
                          >
                            🦁 {sp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Activity Type</Label>
                    <Select
                      value={typeFilter}
                      onValueChange={(value) => setTypeFilter(value || "all")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className={"w-full p-3"}>
                        <SelectItem value="all">📋 All Types</SelectItem>
                        <SelectItem value="PATROL">🚓 Patrol</SelectItem>
                        <SelectItem value="WILDLIFE_SIGHTING">
                          🐅 Wildlife Sighting
                        </SelectItem>
                        <SelectItem value="ILLEGAL_ACTIVITY">
                          ⚠️ Illegal Activity
                        </SelectItem>
                        <SelectItem value="FOREST_FIRE">
                          🔥 Forest Fire
                        </SelectItem>
                        <SelectItem value="RESCUE_OPERATION">
                          🆘 Rescue Operation
                        </SelectItem>
                        <SelectItem value="RESEARCH_SURVEY">
                          📊 Research Survey
                        </SelectItem>
                        <SelectItem value="AWARENESS_PROGRAM">
                          📢 Awareness Program
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value || "all")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className={"w-full p-3"}>
                        <SelectItem value="all">📌 All Status</SelectItem>
                        <SelectItem value="PENDING">⏳ Pending</SelectItem>
                        <SelectItem value="VERIFIED">✅ Verified</SelectItem>
                        <SelectItem value="REJECTED">❌ Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: {search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearch("")}
              />
            </Badge>
          )}
          {locationFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Location:{" "}
              {locations.find((l: any) => l.id === locationFilter)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setLocationFilter("all")}
              />
            </Badge>
          )}
          {speciesFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Species: {species.find((s: any) => s.id === speciesFilter)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSpeciesFilter("all")}
              />
            </Badge>
          )}
          {typeFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {typeLabels[typeFilter]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setTypeFilter("all")}
              />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setStatusFilter("all")}
              />
            </Badge>
          )}
        </div>
      )}

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : activities.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No activities found</p>
            {hasActiveFilters ? (
              <Button variant="link" onClick={clearAllFilters} className="mt-2">
                Clear filters
              </Button>
            ) : (
              <Button variant="link" className="mt-2">
                <Link to="/activities/create">Report your first activity</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {activities.map((activity: Activity, index: number) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border/50 hover:border-primary/30 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-xl">
                            {typeIcons[activity.type] || "📍"}
                          </span>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {activity.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={statusColors[activity.status]}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {format(new Date(activity.date), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{activity.location?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>{activity.reportedBy?.name}</span>
                          </div>
                          {activity.speciesReports &&
                            activity.speciesReports.length > 0 && (
                              <div className="flex items-center gap-1">
                                <PawPrint className="h-3.5 w-3.5" />
                                <span>
                                  {activity.speciesReports.length} species
                                  sighted
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Link to={`/activities/${activity.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Link to={`/activities/${activity.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedActivity(activity);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedActivity?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label className={`text-sm font-medium ${className || ""}`}>{children}</label>
);
