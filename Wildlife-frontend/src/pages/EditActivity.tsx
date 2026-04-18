/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  activityService,
  type CreateActivityData,
} from "../services/activity.service";
import { locationService, type Location } from "../services/location.service";
import { speciesService, type Species } from "../services/species.service";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { PageTransition } from "../components/animations/PageTransition";
import toast from "react-hot-toast";

const activitySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().max(2000).optional(),
  type: z.string().min(1, "Type is required"),
  date: z.string().optional(),
  locationId: z.string().min(1, "Location is required"),
  participantId: z.string().optional(),
  findings: z.string().max(2000).optional(),
  actionTaken: z.string().max(2000).optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface SpeciesReport {
  id?: string;
  speciesId: string;
  count: number;
  notes?: string;
  behavior?: string;
}

export const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [speciesReports, setSpeciesReports] = useState<SpeciesReport[]>([
    { speciesId: "", count: 1 },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch activity data
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityService.getById(id!),
    enabled: !!id,
  });

  // Fetch locations
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ["locations", "all"],
    queryFn: () => locationService.getAll({ limit: 100 }),
  });

  // Fetch species
  const { data: speciesData, isLoading: speciesLoading } = useQuery({
    queryKey: ["species", "all"],
    queryFn: () => speciesService.getAll({ limit: 100 }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      date: new Date().toISOString().split("T")[0],
      locationId: "",
      participantId: "",
      findings: "",
      actionTaken: "",
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (activityData?.data?.activity && !activityLoading) {
      const activity = activityData.data.activity;

      reset({
        title: activity.title,
        description: activity.description || "",
        type: activity.type,
        date: activity.date
          ? new Date(activity.date).toISOString().split("T")[0]
          : "",
        locationId: activity.locationId,
        participantId: activity.participantId || "",
        findings: activity.findings || "",
        actionTaken: activity.actionTaken || "",
      });

      if (activity.speciesReports && activity.speciesReports.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSpeciesReports(
          activity.speciesReports.map((sr: any) => ({
            id: sr.id,
            speciesId: sr.speciesId,
            count: sr.count,
            notes: sr.notes || "",
            behavior: sr.behavior || "",
          })),
        );
      } else {
        setSpeciesReports([{ speciesId: "", count: 1 }]);
      }

      setIsLoading(false);
    }
  }, [activityData, activityLoading, reset]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateActivityData>;
    }) => activityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      toast.success("Activity updated successfully! ✏️");
      navigate("/activities");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update activity");
    },
  });

  const onSubmit = async (data: ActivityFormData) => {
    const formattedDate = data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString();

    const payload: CreateActivityData = {
      title: data.title,
      description: data.description || undefined,
      type: data.type,
      date: formattedDate,
      locationId: data.locationId,
      participantId: data.participantId || undefined,
      findings: data.findings || undefined,
      actionTaken: data.actionTaken || undefined,
      speciesReports: speciesReports
        .filter((sr) => sr.speciesId)
        .map((sr) => ({
          speciesId: sr.speciesId,
          count: sr.count,
          notes: sr.notes || undefined,
          behavior: sr.behavior || undefined,
        })),
    };

    updateMutation.mutate({ id: id!, data: payload });
  };

  const addSpeciesReport = () => {
    setSpeciesReports([...speciesReports, { speciesId: "", count: 1 }]);
  };

  const removeSpeciesReport = (index: number) => {
    if (speciesReports.length > 1) {
      setSpeciesReports(speciesReports.filter((_, i) => i !== index));
    }
  };

  const updateSpeciesReport = (
    index: number,
    field: keyof SpeciesReport,
    value: any,
  ) => {
    const updated = [...speciesReports];
    updated[index] = { ...updated[index], [field]: value };
    setSpeciesReports(updated);
  };

  const locations = locationsData?.data?.locations || [];
  const species = speciesData?.data?.species || [];
  const activity = activityData?.data?.activity;

  if (isLoading || activityLoading || locationsLoading || speciesLoading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-64" />
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  if (!activity) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Activity Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The activity you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/activities")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/activities")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Edit Activity
            </h1>
            <p className="text-muted-foreground mt-1">
              Update your forest monitoring activity
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter activity title"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type *</Label>
                  <Select
                    onValueChange={(v) => setValue("type", v!)}
                    value={watch("type")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
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
                  {errors.type && (
                    <p className="text-sm text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" {...register("date")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationId">Location *</Label>
                  <Select
                    onValueChange={(v) => setValue("locationId", v!)}
                    value={watch("locationId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc: Location) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.locationId && (
                    <p className="text-sm text-destructive">
                      {errors.locationId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Describe the activity..."
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Species Sighted
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpeciesReport}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Species
                </Button>
              </div>

              {speciesReports.map((report, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Species #{index + 1}
                    </span>
                    {speciesReports.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpeciesReport(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select
                      value={report.speciesId}
                      onValueChange={(v) =>
                        updateSpeciesReport(index, "speciesId", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        {species.map((sp: Species) => (
                          <SelectItem key={sp.id} value={sp.id}>
                            {sp.name} ({sp.scientificName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Count"
                      value={report.count}
                      onChange={(e) =>
                        updateSpeciesReport(
                          index,
                          "count",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                    <Input
                      placeholder="Behavior (e.g., Resting, Hunting)"
                      value={report.behavior || ""}
                      onChange={(e) =>
                        updateSpeciesReport(index, "behavior", e.target.value)
                      }
                      className="md:col-span-2"
                    />
                    <Input
                      placeholder="Additional notes"
                      value={report.notes || ""}
                      onChange={(e) =>
                        updateSpeciesReport(index, "notes", e.target.value)
                      }
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Observations</h2>
              <div className="space-y-2">
                <Label htmlFor="findings">Findings</Label>
                <Textarea
                  id="findings"
                  rows={3}
                  placeholder="What did you observe?"
                  {...register("findings")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionTaken">Action Taken</Label>
                <Textarea
                  id="actionTaken"
                  rows={3}
                  placeholder="What actions were taken?"
                  {...register("actionTaken")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/activities")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};
