/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  PawPrint,
  Edit,
} from "lucide-react";
import { activityService } from "../services/activity.service";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Spinner } from "../components/ui/spinner";

const statusConfig: Record<
  string,
  { label: string; icon: any; color: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  VERIFIED: {
    label: "Verified",
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

const typeIcons: Record<string, string> = {
  PATROL: "🚓 Patrol",
  WILDLIFE_SIGHTING: "🐅 Wildlife Sighting",
  ILLEGAL_ACTIVITY: "⚠️ Illegal Activity",
  FOREST_FIRE: "🔥 Forest Fire",
  RESCUE_OPERATION: "🆘 Rescue Operation",
  RESEARCH_SURVEY: "📊 Research Survey",
  AWARENESS_PROGRAM: "📢 Awareness Program",
};

export const ActivityDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityService.getById(id!),
    enabled: !!id,
  });

  const verifyMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: string;
      notes?: string;
    }) => activityService.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Activity verified successfully! ✅");
      setVerifyDialogOpen(false);
      setRejectDialogOpen(false);
      setRejectReason("");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleVerify = () => {
    setIsSubmitting(true);
    verifyMutation.mutate({ id: id!, status: "VERIFIED" });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setIsSubmitting(true);
    verifyMutation.mutate({ id: id!, status: "REJECTED", notes: rejectReason });
  };

  const activity = data?.data?.activity;

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!activity) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Activity not found</p>
        <Button variant="link" className="mt-2">
          <Link to="/activities">Back to Activities</Link>
        </Button>
      </div>
    );
  }

  const StatusIcon = statusConfig[activity.status]?.icon || Clock;
  const canChangeStatus = isAdmin && activity.status === "PENDING";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Link to="/activities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{activity.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusConfig[activity.status]?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[activity.status]?.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {typeIcons[activity.type]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canChangeStatus && (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => setVerifyDialogOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Verify
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Link to={`/activities/${activity.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date & Location
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Reported on:</strong>{" "}
                {format(new Date(activity.createdAt), "MMMM dd, yyyy hh:mm a")}
              </p>
              <p>
                <strong>Activity date:</strong>{" "}
                {format(new Date(activity.date), "MMMM dd, yyyy")}
              </p>
              <p>
                <strong>Location:</strong> {activity.location?.name}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Reported By
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {activity.reportedBy?.name}
              </p>
              <p>
                <strong>Email:</strong> {activity.reportedBy?.email}
              </p>
              {activity.participant && (
                <p>
                  <strong>Organization:</strong> {activity.participant.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {activity.description && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              Description
            </h2>
            <p className="text-muted-foreground">{activity.description}</p>
          </CardContent>
        </Card>
      )}

      {activity.speciesReports && activity.speciesReports.length > 0 && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-3">
              <PawPrint className="h-4 w-4 text-primary" />
              Species Sighted
            </h2>
            <div className="space-y-3">
              {activity.speciesReports.map((report: any) => (
                <div key={report.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{report.species?.name}</span>
                    <Badge variant="outline">Count: {report.count}</Badge>
                  </div>
                  {report.behavior && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Behavior: {report.behavior}
                    </p>
                  )}
                  {report.notes && (
                    <p className="text-sm text-muted-foreground">
                      {report.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(activity.findings || activity.actionTaken) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activity.findings && (
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">Findings</h2>
                <p className="text-muted-foreground">{activity.findings}</p>
              </CardContent>
            </Card>
          )}
          {activity.actionTaken && (
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">Action Taken</h2>
                <p className="text-muted-foreground">{activity.actionTaken}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activity.status !== "PENDING" && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-2">Verification</h2>
            <p className="text-sm">
              <strong>Status:</strong> {activity.status}
            </p>
            {activity.verifiedAt && (
              <p className="text-sm text-muted-foreground">
                on{" "}
                {format(new Date(activity.verifiedAt), "MMMM dd, yyyy hh:mm a")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify this activity? This will mark it
              as verified and it will be visible to all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify} className="bg-green-500" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <Spinner className="animate-spin"/>
                ):"Verify"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this activity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>Reason for rejection *</Label>
            <Textarea
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-500">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

const DetailsSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
    <Skeleton className="h-32 rounded-xl" />
  </div>
);
