import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Calendar,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  MapPin,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAuthStore } from "../../stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Species", href: "/species", icon: PawPrint },
  { name: "Participants", href: "/participants", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigate = useNavigate();
 const handleLogout = () => {
  logout();
  navigate("/login"); // ✅
};

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <motion.div
        className="h-16 flex items-center justify-between px-4 border-b border-border"
        animate={{ justifyContent: collapsed ? "center" : "space-between" }}
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              ForestWatch
            </span>
          </motion.div>
        )}
        {collapsed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center"
          >
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <TooltipProvider closeDelay={0}>
          {navigation.map((item) => {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger>
                  <NavLink
                    to={item.href}
                    onClick={() => mobileOpen && setMobileOpen(false)}
                    className={({ isActive: active }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        active &&
                          "bg-primary/10 text-primary border-l-2 border-primary",
                        collapsed ? "justify-center" : "justify-start",
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        location.pathname === item.href && "text-primary",
                      )}
                    />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-popover text-popover-foreground"
                  >
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="border-t border-border p-3 space-y-2">
        <TooltipProvider closeDelay={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200",
                  collapsed
                    ? "justify-center px-2"
                    : "justify-start gap-3 px-3",
                )}
                onClick={() =>
                  !collapsed && (window.location.href = "/profile")
                }
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.role}
                    </p>
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent
                side="right"
                className="bg-popover text-popover-foreground"
              >
                {user?.name}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider closeDelay={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                  collapsed
                    ? "justify-center px-2"
                    : "justify-start gap-3 px-3",
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent
                side="right"
                className="bg-popover text-popover-foreground"
              >
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
        className="hidden md:block fixed left-0 top-0 bottom-0 z-50 bg-card shadow-xl"
      >
        {sidebarContent}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden bg-card shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
