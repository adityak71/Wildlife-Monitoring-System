import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingDown,
  AlertTriangle,
  Shield,
  Info,
  Leaf,
} from "lucide-react";
import {
  speciesService,
  type Species as SpeciesType,
} from "../services/species.service";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { CardSkeleton } from "../components/skeletons/CardSkeleton";
import toast from "react-hot-toast";

const conservationStatuses = [
  {
    value: "CRITICALLY_ENDANGERED",
    label: "Critically Endangered",
    color: "bg-red-600 text-white",
    icon: AlertTriangle,
    order: 1,
  },
  {
    value: "ENDANGERED",
    label: "Endangered",
    color: "bg-orange-500 text-white",
    icon: TrendingDown,
    order: 2,
  },
  {
    value: "VULNERABLE",
    label: "Vulnerable",
    color: "bg-yellow-500 text-white",
    icon: AlertTriangle,
    order: 3,
  },
  {
    value: "NEAR_THREATENED",
    label: "Near Threatened",
    color: "bg-lime-500 text-white",
    icon: Shield,
    order: 4,
  },
  {
    value: "LEAST_CONCERN",
    label: "Least Concern",
    color: "bg-green-500 text-white",
    icon: Shield,
    order: 5,
  },
  {
    value: "DATA_DEFICIENT",
    label: "Data Deficient",
    color: "bg-gray-500 text-white",
    icon: Info,
    order: 6,
  },
];

const categories = [
  "Mammal",
  "Bird",
  "Reptile",
  "Amphibian",
  "Fish",
  "Plant",
  "Insect",
  "Other",
];

export const Species = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesType | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<SpeciesType>>({
    name: "",
    scientificName: "",
    commonName: "",
    category: "",
    conservationStatus: "LEAST_CONCERN",
    population: undefined,
    habitat: "",
    threats: [],
    description: "",
    imageUrl: "",
  });
  const [newThreat, setNewThreat] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["species", page, search, statusFilter, categoryFilter],
    queryFn: () =>
      speciesService.getAll({
        page,
        limit: 12,
        search: search || undefined,
        conservationStatus:
          statusFilter === "all" || statusFilter === null
            ? undefined
            : statusFilter,
        category:
          categoryFilter === "all" || categoryFilter === null
            ? undefined
            : categoryFilter,
      }),
  });

  const createMutation = useMutation({
    mutationFn: speciesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species added successfully! 🎉");
      setIsCreateOpen(false);
      resetForm();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create species");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpeciesType> }) =>
      speciesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species updated successfully! ✏️");
      setIsEditOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update species"),
  });

  const deleteMutation = useMutation({
    mutationFn: speciesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species deleted successfully! 🗑️");
      setIsDeleteOpen(false);
      setSelectedSpecies(null);
    },
    onError: () => toast.error("Failed to delete species"),
  });

  const species = data?.data?.species || [];
  const pagination = data?.data?.pagination;

  const resetForm = () => {
    setFormData({
      name: "",
      scientificName: "",
      commonName: "",
      category: "",
      conservationStatus: "LEAST_CONCERN",
      population: undefined,
      habitat: "",
      threats: [],
      description: "",
      imageUrl: "",
    });
    setNewThreat("");
  };

  const handleCreate = () => {
    if (!formData.name || !formData.scientificName || !formData.category) {
      toast.error("Please fill required fields");
      return;
    }
    console.log(formData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createMutation.mutate(formData as any);
  };

  const handleUpdate = () => {
    if (selectedSpecies) {
      updateMutation.mutate({ id: selectedSpecies.id, data: formData });
    }
  };

  const handleDelete = () => {
    if (selectedSpecies) {
      deleteMutation.mutate(selectedSpecies.id);
    }
  };

  const openEditModal = (species: SpeciesType) => {
    setSelectedSpecies(species);
    setFormData({
      name: species.name,
      scientificName: species.scientificName,
      commonName: species.commonName || "",
      category: species.category,
      conservationStatus: species.conservationStatus,
      population: species.population,
      habitat: species.habitat || "",
      threats: species.threats || [],
      description: species.description || "",
      imageUrl: species.imageUrl || "",
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

  const getStatusConfig = (status: string) => {
    return (
      conservationStatuses.find((s) => s.value === status) ||
      conservationStatuses[4]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
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
            Species Database
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage wildlife species, their conservation status, and
            population
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Species
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or scientific name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Conservation Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {conservationStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className="flex items-center gap-2">
                  <status.icon className="h-3 w-3" />
                  {status.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {isLoading ? (
        <CardSkeleton count={12} columns={3} />
      ) : species.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No species found</p>
          <Button variant="link" onClick={() => setIsCreateOpen(true)}>
            Add your first species
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {species.map((speciesItem: SpeciesType) => {
              const statusConfig = getStatusConfig(
                speciesItem.conservationStatus || "",
              );
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={speciesItem.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  layout
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full group">
                    <div
                      className={`h-2 ${statusConfig.color.replace("text-white", "").replace("bg-", "bg-")}`}
                    />

                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Leaf className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className={`${statusConfig.color} border-none`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {speciesItem.name}
                      </h3>

                      <p className="text-sm text-muted-foreground italic mb-2 line-clamp-1">
                        {speciesItem.scientificName}
                      </p>

                      <Badge variant="outline" className="mb-3 text-xs">
                        {speciesItem.category}
                      </Badge>

                      {speciesItem.population && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Population:</span>
                          <span>{speciesItem.population.toLocaleString()}</span>
                        </div>
                      )}

                      {speciesItem.habitat && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {speciesItem.habitat}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(speciesItem)}
                          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedSpecies(speciesItem);
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
              {isCreateOpen ? "Add New Species" : "Edit Species"}
            </DialogTitle>
            <DialogDescription>
              {isCreateOpen
                ? "Add a new species to the conservation database"
                : "Update species information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Common Name *</Label>
                <Input
                  placeholder="e.g., Bengal Tiger"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Scientific Name *</Label>
                <Input
                  placeholder="e.g., Panthera tigris tigris"
                  value={formData.scientificName}
                  onChange={(e) =>
                    setFormData({ ...formData, scientificName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Common Name (Local)</Label>
                <Input
                  placeholder="e.g., Bagh"
                  value={formData.commonName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, commonName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Conservation Status *</Label>
                <Select
                  value={formData.conservationStatus}
                  onValueChange={(v) =>
                    setFormData({ ...formData, conservationStatus: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conservationStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <span className="flex items-center gap-2">
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estimated Population</Label>
                <Input
                  type="number"
                  placeholder="e.g., 2967"
                  value={formData.population || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      population: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Habitat</Label>
              <Textarea
                placeholder="Describe the natural habitat..."
                value={formData.habitat || ""}
                onChange={(e) =>
                  setFormData({ ...formData, habitat: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Threats</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a threat (e.g., Poaching, Habitat Loss)"
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

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Additional information about the species..."
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
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
              {isCreateOpen ? "Add Species" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedSpecies?.name}" from the
              database. All sighting reports associated with this species will
              also be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
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
