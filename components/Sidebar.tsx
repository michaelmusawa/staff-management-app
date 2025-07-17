// components/Sidebar.tsx

"use client";
import Link from "next/link";
import {
  FiHome,
  FiUsers,
  FiShuffle,
  FiCalendar,
  FiClipboard,
  FiMail,
  FiBarChart2,
  FiLogOut,
  FiSettings,
  FiBriefcase,
} from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/dashboard/staffs", label: "Staff Management", icon: FiUsers },
  { href: "/dashboard/transfers", label: "Transfer Requests", icon: FiShuffle },
  { href: "/dashboard/attendance", label: "Attendance", icon: FiCalendar },
  { href: "/dashboard/leaves", label: "Leave Management", icon: FiClipboard },
  { href: "/dashboard/correspondence", label: "Correspondence", icon: FiMail },
  {
    href: "/dashboard/reports",
    label: "Reports & Analytics",
    icon: FiBarChart2,
  },
  { href: "/dashboard/settings", label: "Settings", icon: FiSettings },
  { href: "/dashboard/allocation", label: "Allocation", icon: FiBriefcase },
  { href: "/dashboard/view", label: "Staff View", icon: FiBriefcase },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-card text-card-foreground shadow-sm">
      {/* Logo and App Name */}
      <div className="flex items-center gap-3 px-6 py-5 border-b">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <div className="bg-white text-blue-600 w-6 h-6 rounded-md flex items-center justify-center font-bold">
            P
          </div>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Inspectorate</h1>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6">
        <div className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <TooltipProvider key={href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={href} passHref>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-12 px-4 transition-all",
                          isActive
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "hover:bg-accent"
                        )}
                      >
                        <Icon
                          className={cn(
                            "mr-3 h-5 w-5 transition-transform",
                            isActive ? "scale-110" : "scale-100"
                          )}
                        />
                        <span className="font-medium">{label}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    {label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </nav>

      {/* User Profile and Settings */}
      <div className="px-3 py-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/admin-avatar.png" />
            <AvatarFallback className="bg-blue-600 text-white">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">
              Station Commander
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-4 text-muted-foreground"
          >
            <FiSettings className="mr-3 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-4 text-muted-foreground"
          >
            <FiLogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
