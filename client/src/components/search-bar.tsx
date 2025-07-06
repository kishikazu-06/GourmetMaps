import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Map } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (genre: string) => void;
  currentFilter: string;
  onToggleMap?: () => void;
  onGetLocation?: () => void;
  className?: string;
}

const genres = [
  { id: "all", label: "すべて" },
  { id: "ラーメン", label: "ラーメン" },
  { id: "カフェ", label: "カフェ" },
  { id: "居酒屋", label: "居酒屋" },
  { id: "スイーツ", label: "スイーツ" },
  { id: "ベーカリー", label: "ベーカリー" },
  { id: "中華", label: "中華" },
  { id: "焼肉", label: "焼肉" },
  { id: "寿司", label: "寿司" }
];

export function SearchBar({ 
  onSearch, 
  onFilterChange, 
  currentFilter, 
  onToggleMap, 
  onGetLocation,
  className 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className={cn("bg-white border-b", className)}>
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Input
            type="text"
            placeholder="お店やメニューを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </form>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGetLocation}
              className="flex items-center space-x-1 bg-secondary text-white border-secondary hover:bg-secondary/90"
            >
              <MapPin className="w-4 h-4" />
              <span>現在地周辺</span>
            </Button>
            <span className="text-sm text-gray-600">射水市中央町周辺</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMap}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary"
          >
            <Map className="w-4 h-4" />
            <span>地図表示</span>
          </Button>
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={currentFilter === genre.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(genre.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors",
                currentFilter === genre.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              {genre.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
