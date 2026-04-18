/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Calendar,
  Activity,
  MapPin,
  Trees,
  PawPrint,
  Edit2,
  Camera,
  Shield,
  Award,
  Clock,
  TrendingUp,
  Users,
  Leaf,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { AnimatedCard } from "../components/animations/AnimatedCard";
import { activityService } from "../services/activity.service";
import toast from "react-hot-toast";
import { format } from "date-fns";

export const Profile = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    organization: "",
    bio: "",
  });

  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => activityService.getStats(),
    enabled: !!user,
  });

  const stats = statsData?.data || {
    totalActivities: 0,
    totalLocations: 0,
    totalSpecies: 0,
    totalParticipants: 0,
    recentActivities: [],
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully! 🎉");
    setIsEditing(false);
    setIsSaving(false);
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  } as const;

  const statCards = [
    {
      label: "Activities",
      value: stats.totalActivities,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Locations",
      value: stats.totalLocations,
      icon: MapPin,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Species Tracked",
      value: stats.totalSpecies,
      icon: PawPrint,
      color: "from-orange-500 to-amber-500",
    },
    {
      label: "Organizations",
      value: stats.totalParticipants,
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and view your activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            <AnimatedCard hoverEffect="glow" delay={0.1}>
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative inline-block"
                >
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20 mx-auto">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground text-2xl">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg">
                    <Camera className="h-3 w-3" />
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-4">
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <Badge variant="outline" className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role}
                  </Badge>
                </motion.div>

                <Separator className="my-4" />

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {format(new Date(), "MMMM yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {stats.totalActivities} total activities
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard hoverEffect="glow" delay={0.2} className="p-5"> 
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-500/10">
                      <Leaf className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <span className="text-sm">Conservationist</span>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    Level 3
                  </Badge>
                </div>
                <Progress value={75} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  75% to next level
                </p>

                <Separator className="my-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <Trees className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <span className="text-sm">Wildlife Tracker</span>
                  </div>
                  <Badge variant="outline" className="text-blue-500">
                    Level 2
                  </Badge>
                </div>
                <Progress value={40} className="h-1.5" />
              </CardContent>
            </AnimatedCard>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">
                              {stat.label}
                            </p>
                          </div>
                          <div
                            className={`p-2 rounded-xl bg-linear-to-br ${stat.color} bg-opacity-10`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <AnimatedCard hoverEffect="glow" delay={0.3} className="p-5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest contributions</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentActivities?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivities.map(
                      (activity: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.type}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.status === "VERIFIED"
                                ? "default"
                                : "outline"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </motion.div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <Button variant="link" className="mt-2">
                      Start your first activity
                    </Button>
                  </div>
                )}
              </CardContent>
            </AnimatedCard>

            <AnimatedCard hoverEffect="glow" delay={0.4} className="p-5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Contribution Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">87</p>
                    <p className="text-xs text-muted-foreground">
                      Total Points
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-xs text-muted-foreground">
                      Badges Earned
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">
                      Reports Verified
                    </p>
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>
          </motion.div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    placeholder="Add your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input
                    value={profileForm.organization}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        organization: e.target.value,
                      })
                    }
                    placeholder="Your organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
