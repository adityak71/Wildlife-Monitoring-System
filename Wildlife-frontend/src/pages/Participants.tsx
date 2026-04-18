import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Building,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import {
  participantService,
  type Participant,
} from "../services/participant.service";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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

import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CardSkeleton } from "../components/skeletons/CardSkeleton";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ForwardRefExoticComponent<
      React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
    bgColor: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
  },
  VERIFIED: {
    label: "Verified",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10 border-green-500/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
};

export const Participants = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [verifyAction, setVerifyAction] = useState<"VERIFIED" | "REJECTED">(
    "VERIFIED",
  );
  const [verifyNotes, setVerifyNotes] = useState("");

  const [formData, setFormData] = useState<Partial<Participant>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    organizationType: "",
    registrationNumber: "",
    notes: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["participants", page, search, statusFilter, activeTab],
    queryFn: () =>
      participantService.getAll({
        page,
        limit: 9,
        search: search || undefined,
        status:
          activeTab === "all"
            ? statusFilter === "all"
              ? undefined
              : statusFilter
            : activeTab,
      }),
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: participantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success(
        "Registration submitted! Waiting for admin verification. 🎉",
      );
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      const message =
        error instanceof Error ? error.message : "Failed to register";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Participant> }) =>
      participantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Organization updated successfully! ✏️");
      setIsEditOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update organization"),
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
    }) => participantService.verify(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success(
        `Organization ${verifyAction.toLowerCase()} successfully! ✅`,
      );
      setIsVerifyOpen(false);
      setVerifyNotes("");
      setSelectedParticipant(null);
    },
    onError: () => toast.error("Failed to update verification status"),
  });

  const deleteMutation = useMutation({
    mutationFn: participantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Organization deleted successfully! 🗑️");
      setIsDeleteOpen(false);
      setSelectedParticipant(null);
    },
    onError: () => toast.error("Failed to delete organization"),
  });

  const participants = data?.data?.participants || [];
  const pagination = data?.data?.pagination;

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      organizationType: "",
      registrationNumber: "",
      notes: "",
    });
  };

  const handleCreate = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.state ||
      !formData.organizationType
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createMutation.mutate(formData as any);
  };

  const handleUpdate = () => {
    if (selectedParticipant) {
      updateMutation.mutate({ id: selectedParticipant.id, data: formData });
    }
  };

  const handleVerify = () => {
    if (selectedParticipant) {
      verifyMutation.mutate({
        id: selectedParticipant.id,
        status: verifyAction,
        notes: verifyNotes,
      });
    }
  };

  const handleDelete = () => {
    if (selectedParticipant) {
      deleteMutation.mutate(selectedParticipant.id);
    }
  };

  const openEditModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    setFormData({
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      address: participant.address || "",
      city: participant.city,
      state: participant.state,
      pincode: participant.pincode || "",
      organizationType: participant.organizationType,
      registrationNumber: participant.registrationNumber || "",
      notes: participant.notes || "",
    });
    setIsEditOpen(true);
  };

  const openVerifyModal = (
    participant: Participant,
    action: "VERIFIED" | "REJECTED",
  ) => {
    setSelectedParticipant(participant);
    setVerifyAction(action);
    setVerifyNotes("");
    setIsVerifyOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  } as const;

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Card className="border-border/50 max-w-md text-center">
          <CardContent className="p-8">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              Only administrators can access the participants management page.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Partner Organizations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage conservation partners, NGOs, and research institutions
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Register Organization
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="VERIFIED">Verified</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <CardSkeleton count={9} columns={3} />
      ) : participants.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No organizations found</p>
          <Button variant="link" onClick={() => setIsCreateOpen(true)}>
            Register your organization
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {participants.map((participant: Participant) => {
              const status =
                statusConfig[participant.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={participant.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  layout
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full group">
                    <div className={`h-1 ${status.bgColor.split(" ")[0]}`} />

                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className={status.bgColor}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {participant.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3">
                        {participant.organizationType}
                      </p>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">
                            {participant.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {participant.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {participant.city}, {participant.state}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        Registered{" "}
                        {formatDistanceToNow(
                          new Date(participant.registeredAt),
                          { addSuffix: true },
                        )}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                        {participant.status === "PENDING" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                openVerifyModal(participant, "VERIFIED")
                              }
                              className="p-2 rounded-lg hover:bg-green-500/10 transition-colors"
                              title="Verify"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                openVerifyModal(participant, "REJECTED")
                              }
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(participant)}
                          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {pagination && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      <Dialog
        open={isCreateOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setIsEditOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateOpen ? "Register Organization" : "Edit Organization"}
            </DialogTitle>
            <DialogDescription>
              {isCreateOpen
                ? "Register your organization to participate in conservation activities"
                : "Update organization information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization Name *</Label>
                <Input
                  placeholder="e.g., WWF India"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Organization Type *</Label>
                <Input
                  placeholder="e.g., NGO, Trust, Research Institute"
                  value={formData.organizationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationType: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="contact@organization.org"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                placeholder="Full address..."
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  placeholder="Pincode"
                  value={formData.pincode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input
                placeholder="Registration / NGO number"
                value={formData.registrationNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Any additional information about your organization..."
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setIsEditOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={isCreateOpen ? handleCreate : handleUpdate}>
              {isCreateOpen ? "Register Organization" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verifyAction === "VERIFIED"
                ? "Verify Organization"
                : "Reject Organization"}
            </DialogTitle>
            <DialogDescription>
              {verifyAction === "VERIFIED"
                ? "Confirm that this organization meets the eligibility criteria."
                : "Provide a reason for rejection."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Organization</Label>
              <p className="text-sm font-medium">{selectedParticipant?.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder={
                  verifyAction === "VERIFIED"
                    ? "Add any verification notes..."
                    : "Reason for rejection..."
                }
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              className={
                verifyAction === "VERIFIED"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }
            >
              {verifyAction === "VERIFIED"
                ? "Verify Organization"
                : "Reject Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedParticipant?.name}" from
              the database. All activities associated with this organization
              will also be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
