import { Home, Search, Map, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "ホーム" },
    { path: "/search", icon: Search, label: "検索" },
    { path: "/map", icon: Map, label: "地図" },
    { path: "/favorites", icon: Heart, label: "お気に入り" },
    { path: "/profile", icon: User, label: "設定" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
      <div className="flex">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          
          return (
            <Link key={path} href={path} className="flex-1">
              <button
                className={cn(
                  "flex flex-col items-center py-2 px-1 text-xs transition-colors w-full",
                  isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
