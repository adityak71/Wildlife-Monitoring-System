import { motion } from "framer-motion";
import {
  useThemeStore,
  colorPalettes,
  darkPalettes,
  type ColorPalette,
  type ThemeMode,
} from "../../stores/themeStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "..//ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Check, Palette, Moon, Sun, Laptop, Sparkles } from "lucide-react";
import { useState } from "react";

const palettes: {
  id: ColorPalette;
  name: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "forest",
    name: "Forest",
    description: "Natural green tones",
    icon: "🌲",
  },
  { id: "ocean", name: "Ocean", description: "Calm blue waves", icon: "🌊" },
  { id: "sunset", name: "Sunset", description: "Warm orange glow", icon: "🌅" },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep purple night",
    icon: "🌙",
  },
  { id: "slack", name: "Slack", description: "Inspired by Slack", icon: "💜" },
  { id: "vscode", name: "VS Code", description: "Developer theme", icon: "💙" },
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

export const AppearanceSettings = () => {
  const { mode, palette, setMode, setPalette } = useThemeStore();
  const [previewPalette, setPreviewPalette] = useState<ColorPalette | null>(
    null,
  );

  const currentColors = previewPalette
    ? mode === "dark"
      ? darkPalettes[previewPalette]
      : colorPalettes[previewPalette]
    : mode === "dark"
      ? darkPalettes[palette]
      : colorPalettes[palette];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose between light, dark, or system default
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as unknown as ThemeMode)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <Label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === m.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={m.id} className="sr-only" />
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        mode === m.id ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          mode === m.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {m.description}
                      </p>
                    </div>
                  </div>
                  {mode === m.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="h-5 w-5 text-primary" />
                    </motion.div>
                  )}
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Color Palette
          </CardTitle>
          <CardDescription>Choose your favorite color scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: `hsl(${currentColors.primary})` }}
                />
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: `hsl(${currentColors.secondary})` }}
                />
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: `hsl(${currentColors.accent})` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {previewPalette ? "Preview" : "Current"} palette
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                size="sm"
                variant="default"
                style={{ backgroundColor: `hsl(${currentColors.primary})` }}
              >
                Primary
              </Button>
              <Button
                size="sm"
                variant="secondary"
                style={{ backgroundColor: `hsl(${currentColors.secondary})` }}
              >
                Secondary
              </Button>
              <Button size="sm" variant="outline" className="border-border">
                Outline
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {palettes.map((p) => {
              const colors =
                mode === "dark" ? darkPalettes[p.id] : colorPalettes[p.id];
              const isActive = palette === p.id;

              return (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPreviewPalette(p.id);
                    setTimeout(() => {
                      setPalette(p.id);
                      setPreviewPalette(null);
                    }, 300);
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div className="text-left">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: `hsl(${colors.primary})` }}
                    />
                    <div
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: `hsl(${colors.secondary})` }}
                    />
                    <div
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: `hsl(${colors.accent})` }}
                    />
                    <div
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: `hsl(${colors.muted})` }}
                    />
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>See how your changes look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `hsl(${currentColors.primary})` }}
                >
                  <span className="text-primary-foreground text-sm">FW</span>
                </div>
                <div>
                  <p className="font-medium">Forest Watch</p>
                  <p className="text-sm text-muted-foreground">
                    Monitoring Dashboard
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                style={{ backgroundColor: `hsl(${currentColors.primary})` }}
              >
                Preview Button
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Total Activities
                </p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Active Locations
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
