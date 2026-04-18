import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import {
  useThemeStore,
  colorPalettes,
  darkPalettes,
  type ColorPalette,
} from "../stores/themeStore";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  User,
  Mail,
  Shield,
  Moon,
  Sun,
  Laptop,
  Palette,
  Sparkles,
  Check,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Bell,
  BellRing,
  Volume2,
  Globe,
  Lock,
  Key,
} from "lucide-react";
import toast from "react-hot-toast";
import { AnimatedCard } from "../components/animations/AnimatedCard";

const palettes: {
  id: ColorPalette;
  name: string;
  description: string;
  icon: string;
  colors: string[];
}[] = [
  {
    id: "forest",
    name: "Forest",
    description: "Natural green tones",
    icon: "🌲",
    colors: ["#10b981", "#059669", "#34d399"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Calm blue waves",
    icon: "🌊",
    colors: ["#3b82f6", "#2563eb", "#60a5fa"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange glow",
    icon: "🌅",
    colors: ["#f97316", "#ea580c", "#fb923c"],
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep purple night",
    icon: "🌙",
    colors: ["#8b5cf6", "#7c3aed", "#a78bfa"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Inspired by Slack",
    icon: "💜",
    colors: ["#e01e5a", "#ecb22e", "#36c5f0"],
  },
  {
    id: "vscode",
    name: "VS Code",
    description: "Developer theme",
    icon: "💙",
    colors: ["#007acc", "#2d2d2d", "#6c6c6c"],
  },
];

const modes = [
  { id: "dark", name: "Dark", icon: Moon, description: "Easy on the eyes" },
  { id: "light", name: "Light", icon: Sun, description: "Bright and clean" },
  {
    id: "system",
    name: "System",
    icon: Laptop,
    description: "Follows device settings",
  },
];

const notificationSettings = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive updates via email",
    icon: Mail,
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Real-time browser notifications",
    icon: Bell,
  },
  {
    id: "sound",
    label: "Sound Alerts",
    description: "Play sound for important alerts",
    icon: Volume2,
  },
];

const privacySettings = [
  {
    id: "profile",
    label: "Public Profile",
    description: "Allow others to see your profile",
    icon: Globe,
  },
  {
    id: "activity",
    label: "Share Activity",
    description: "Show your activities to other users",
    icon: Eye,
  },
];

export const Settings = () => {
  const { user, logout } = useAuthStore();
  const { mode, palette, setMode, setPalette } = useThemeStore();

  const [activeTab, setActiveTab] = useState("appearance");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    organization: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const currentColors =
    mode === "dark" ? darkPalettes[palette] : colorPalettes[palette];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully! 🎉");
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Password changed successfully! 🔒");
    setPasswordForm({ current: "", new: "", confirm: "" });
    setIsSaving(false);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  } as const;

  return (
    <div>
      <div className="space-y-4 sm:space-y-6 max-w-full px-2 sm:px-0">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="px-1"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Customize your experience and manage your account
          </p>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto pb-2"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex flex-col"
          >
            <TabsList className="flex w-full min-w-max sm:min-w-0 sm:grid sm:grid-cols-4 gap-1 sm:gap-0 p-1 flex-col">
              <TabsTrigger
                value="appearance"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Appearance</span>
                <span className="xs:hidden">Theme</span>
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Profile</span>
                <span className="xs:hidden">Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Notifications</span>
                <span className="xs:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Security</span>
                <span className="xs:hidden">Privacy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="appearance"
              className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 "
            >
              <AnimatedCard hoverEffect="glow" delay={0.1} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Theme Mode
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Choose between light, dark, or system default
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={mode}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onValueChange={(v) => setMode(v as any)}
                    className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4"
                  >
                    {modes.map((m) => {
                      const Icon = m.icon;
                      return (
                        <label
                          key={m.id}
                          className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            mode === m.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={m.id} className="sr-only" />
                          <div
                            className={`p-1.5 sm:p-2 rounded-lg ${mode === m.id ? "bg-primary/10" : "bg-muted"}`}
                          >
                            <Icon
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base">
                              {m.name}
                            </p>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                              {m.description}
                            </p>
                          </div>
                          {mode === m.id && (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          )}
                        </label>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard hoverEffect="glow" delay={0.2} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Color Palette
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Choose your favorite color scheme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Live Preview
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Button
                        size="sm"
                        className="text-xs sm:text-sm px-3 sm:px-4"
                        style={{
                          backgroundColor: `hsl(${currentColors.primary})`,
                        }}
                      >
                        Primary
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs sm:text-sm px-3 sm:px-4"
                        style={{
                          backgroundColor: `hsl(${currentColors.secondary})`,
                        }}
                      >
                        Secondary
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Outline
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                    {palettes.map((p) => {
                      const isActive = palette === p.id;
                      return (
                        <motion.button
                          key={p.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPalette(p.id)}
                          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all ${
                            isActive
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <span className="text-xl sm:text-2xl">
                              {p.icon}
                            </span>
                            <div className="text-left">
                              <p className="font-medium text-sm sm:text-base">
                                {p.name}
                              </p>
                              <p className="text-xs text-muted-foreground hidden sm:block">
                                {p.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {p.colors.map((color, i) => (
                              <div
                                key={i}
                                className="h-1.5 sm:h-2 flex-1 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          {isActive && (
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>

            <TabsContent
              value="profile"
              className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
            >
              <AnimatedCard hoverEffect="glow" delay={0.1} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-primary/20 mx-auto sm:mx-0">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl sm:text-2xl">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <Badge variant="outline" className="mb-2">
                        {user?.role}
                      </Badge>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Member since {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Full Name</Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Your name"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Email Address</Label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Phone Number</Label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Organization</Label>
                      <Input
                        value={profileForm.organization}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            organization: e.target.value,
                          })
                        }
                        placeholder="Your organization"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="gap-2 text-sm"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>

            <TabsContent
              value="notifications"
              className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
            >
              <AnimatedCard hoverEffect="glow" delay={0.1} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <BellRing className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Manage how you receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notificationSettings.map((setting, idx) => {
                    const Icon = setting.icon;
                    return (
                      <motion.div
                        key={setting.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              {setting.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked className="ml-auto sm:ml-0" />
                      </motion.div>
                    );
                  })}
                </CardContent>
              </AnimatedCard>
            </TabsContent>

            <TabsContent
              value="security"
              className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
            >
              <AnimatedCard hoverEffect="glow" delay={0.1} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.current}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            current: e.target.value,
                          })
                        }
                        className="pl-9 pr-10 text-sm"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.new}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            new: e.target.value,
                          })
                        }
                        className="pl-9 pr-10 text-sm"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirm New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.confirm}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirm: e.target.value,
                          })
                        }
                        className="pl-9 pr-10 text-sm"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 order-2 sm:order-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                      {showPassword ? "Hide password" : "Show password"}
                    </button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="order-1 sm:order-2 text-sm"
                    >
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard hoverEffect="glow" delay={0.2} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Control your privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {privacySettings.map((setting, idx) => {
                    const Icon = setting.icon;
                    return (
                      <motion.div
                        key={setting.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              {setting.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked className="ml-auto sm:ml-0" />
                      </motion.div>
                    );
                  })}
                </CardContent>
              </AnimatedCard>

              <AnimatedCard hoverEffect="glow" delay={0.3} className="p-5">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-destructive">
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div>
                      <p className="font-medium text-destructive text-sm sm:text-base">
                        Logout from all devices
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sign out from all active sessions
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={logout}
                      size="sm"
                      className="gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout All
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};
