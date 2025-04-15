import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  Plane,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: Building,
  },
  {
    title: "Employee List",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Leaves",
    url: "/leaves",
    icon: Plane,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user data from localStorage or API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);

          // If basic info is missing, fetch from API
          if (!parsedUser.name || !parsedUser.avatarUrl) {
            const response = await apiReq.get("/Auth/user-profile");
            if (response.data) {
              const updatedUser = {
                ...parsedUser,
                name: response.data.name || parsedUser.name,
                avatarUrl: response.data.avatar || parsedUser.avatarUrl,
              };
              setUserData(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          }
        } else {
          // Fallback to API if no localStorage data
          const response = await apiReq.get("/Auth/user-profile");
          if (response.data) {
            setUserData(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      // Optional: Call logout API if you have one
      // await apiReq.post("/Auth/logout");

      // Clear user data from storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/login");

      toast.success("Logged out successfully", { id: toastId });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <Sidebar className="border-r border-border bg-background flex flex-col justify-between">
        {/* Loading skeleton or placeholder */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-border bg-background flex flex-col justify-between">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 my-2.5 text-lg font-semibold tracking-wide text-muted-foreground">
            Employee Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={url}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={userData?.avatar || "https://github.com/shadcn.png"}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {userData?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left overflow-hidden">
                <p className="text-sm font-medium truncate max-w-[160px]">
                  {userData?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className="flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}
