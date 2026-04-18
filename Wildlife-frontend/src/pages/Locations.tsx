import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Trees,
  AreaChart,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { locationService, type Location } from "../services/location.service";
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
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";

const forestTypeIcons: Record<string, string> = {
  "Tropical Moist Deciduous": "🌳",
  "Tropical Dry Deciduous": "🍂",
  "Tropical Evergreen": "🌲",
  Mangrove: "🌊",
  "Swampy Grasslands": "🌾",
  "Dry Deciduous": "🍁",
  Montane: "⛰️",
};

export const Locations = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<Location>>({
    name: "",
    description: "",
    latitude: 0,
    longitude: 0,
    area: undefined,
    forestType: "",
    threats: [],
  });
  const [newThreat, setNewThreat] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["locations", page, search],
    queryFn: () =>
      locationService.getAll({
        page,
        limit: 9,
        search: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: locationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location created successfully! 🎉");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create location"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Location> }) =>
      locationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location updated successfully! ✏️");
      setIsEditOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update location"),
  });

  const deleteMutation = useMutation({
    mutationFn: locationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location deleted successfully! 🗑️");
      setIsDeleteOpen(false);
      setSelectedLocation(null);
    },
    onError: () => toast.error("Failed to delete location"),
  });

  const locations = data?.data?.locations || [];
  const pagination = data?.data?.pagination;

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      latitude: 0,
      longitude: 0,
      area: undefined,
      forestType: "",
      threats: [],
    });
    setNewThreat("");
  };

  const handleCreate = () => {
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast.error("Please fill required fields");
      return;
    }
    createMutation.mutate(formData as Location);
  };

  const handleUpdate = () => {
    if (selectedLocation) {
      updateMutation.mutate({ id: selectedLocation.id, data: formData });
    }
  };

  const handleDelete = () => {
    if (selectedLocation) {
      deleteMutation.mutate(selectedLocation.id);
    }
  };

  const openEditModal = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      latitude: location.latitude,
      longitude: location.longitude,
      area: location.area,
      forestType: location.forestType || "",
      threats: location.threats || [],
    });
    setIsEditOpen(true);
  };

  const addThreat = () => {
    if (newThreat.trim() && formData.threats) {
      setFormData({
        ...formData,
        threats: [...formData.threats, newThreat.trim()],
      });
      setNewThreat("");
    }
  };

  const removeThreat = (index: number) => {
    if (formData.threats) {
      setFormData({
        ...formData,
        threats: formData.threats.filter((_, i) => i !== index),
      });
    }
  };

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
    hover: {
      y: -8,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
  } as const;

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
            Protected Locations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage forest areas, national parks, and wildlife sanctuaries
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <Trees className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No locations found</p>
          <Button variant="link" onClick={() => setIsCreateOpen(true)}>
            Add your first location
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
            {locations.map((location: Location) => (
              <motion.div
                key={location.id}
                variants={itemVariants}
                whileHover="hover"
                layout
                className="group"
              >
                <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-32 bg-linear-to-br from-primary/20 via-primary/10 to-secondary/20 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-black/20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.4 }}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-sm"
                      >
                        <span className="mr-1">
                          {forestTypeIcons[location.forestType || ""] || "🌲"}
                        </span>
                        {location.forestType || "Forest"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1 text-white">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {location.latitude}°, {location.longitude}°
                        </span>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Trees className="h-16 w-16 text-white/20" />
                    </motion.div>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-semibold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {location.name}
                    </h3>

                    {location.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {location.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {location.area && (
                        <div className="flex items-center gap-1">
                          <AreaChart className="h-3.5 w-3.5" />
                          <span>{location.area} km²</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        <span>
                          {location._count?.activities || 0} activities
                        </span>
                      </div>
                    </div>

                    {location.threats && location.threats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {location.threats.slice(0, 2).map((threat, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-red-500/10 text-red-500 border-red-500/20"
                          >
                            <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                            {threat}
                          </Badge>
                        ))}
                        {location.threats.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{location.threats.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(location)}
                        className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedLocation(location);
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
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {pagination && pagination.totalPages > 1 && (
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
              {isCreateOpen ? "Add New Location" : "Edit Location"}
            </DialogTitle>
            <DialogDescription>
              {isCreateOpen
                ? "Add a new protected area to the monitoring system"
                : "Update location information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Location Name *</Label>
              <Input
                placeholder="e.g., Jim Corbett National Park"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the location..."
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude *</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g., 29.536"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude *</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g., 78.770"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Area (km²)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 1318.5"
                  value={formData.area || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Forest Type</Label>
                <Input
                  placeholder="e.g., Tropical Moist Deciduous"
                  value={formData.forestType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, forestType: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Threats</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a threat (e.g., Poaching)"
                  value={newThreat}
                  onChange={(e) => setNewThreat(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addThreat()}
                />
                <Button type="button" onClick={addThreat} size="sm">
                  Add
                </Button>
              </div>
              {formData.threats && formData.threats.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.threats.map((threat, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {threat}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeThreat(i)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
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
              {isCreateOpen ? "Create Location" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedLocation?.name}" and all
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm" variant="outline">
              Cancel
            </AlertDialogCancel>
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
