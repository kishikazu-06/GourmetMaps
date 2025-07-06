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
    <>
      {/* Mobile Bottom Navigation */}
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

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r shadow-lg z-50 flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800">まちの推しグルメMAP</h1>
              <p className="text-xs text-gray-600">射水市グルメ発見</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 py-4">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            
            return (
              <Link key={path} href={path}>
                <button
                  className={cn(
                    "flex items-center space-x-3 px-6 py-3 text-sm transition-colors w-full text-left",
                    isActive
                      ? "text-primary bg-primary/10 border-r-2 border-primary"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              </Link>
            );
          })}
        </div>
        
        <div className="p-6 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <p>登録店舗数: 9店舗</p>
            <p>© 2025 まちの推しグルメMAP</p>
          </div>
        </div>
      </nav>
    </>
  );
}
