import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/ThemeProvider";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AnimatedBackground } from "./components/animations/AnimatedBackground";
import { FloatingElements } from "./components/animations/FloatingElements";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Activities } from "./pages/Activities";
import { CreateActivity } from "./pages/CreateActivity";
import { ActivityDetails } from "./pages/ActivityDetails";
import { Locations } from "./pages/Locations";
import { Species } from "./pages/Species";
import { Participants } from "./pages/Participants";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { EditActivity } from "./pages/EditActivity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AnimatedBackground />
          <FloatingElements />
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/create" element={<CreateActivity />} />
              <Route path="/activities/:id" element={<ActivityDetails />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/species" element={<Species />} />
              <Route path="/participants" element={<Participants />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/activities/:id/edit" element={<EditActivity />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
