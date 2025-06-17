import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Coffee, Utensils } from "lucide-react";

interface MapSectionProps {
  onOpenFullMap?: () => void;
  className?: string;
}

export function MapSection({ onOpenFullMap, className }: MapSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">地図で探す</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenFullMap}
            className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm font-medium"
          >
            <span>全画面で開く</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative bg-gray-200 rounded-xl h-64 overflow-hidden">
          {/* Map placeholder - In a real implementation, integrate Google Maps API here */}
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
            alt="射水市の地図"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-lg font-medium">Google Maps連携</p>
              <p className="text-sm opacity-90">お店の位置とルート案内</p>
            </div>
          </div>
          
          {/* Map markers overlay */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-white">
              <MapPin className="w-3 h-3 mr-1" />
              現在地
            </Badge>
          </div>
          
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge 
              className="bg-secondary text-white hover:scale-110 transition-transform cursor-pointer"
              onClick={() => {/* Navigate to restaurant */}}
            >
              <Utensils className="w-3 h-3 mr-1" />
              麺屋 射水
            </Badge>
          </div>
          
          <div className="absolute bottom-1/3 right-1/4">
            <Badge 
              className="bg-accent text-gray-800 hover:scale-110 transition-transform cursor-pointer"
              onClick={() => {/* Navigate to restaurant */}}
            >
              <Coffee className="w-3 h-3 mr-1" />
              カフェ・ド・マルシェ
            </Badge>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Google Maps APIを使用してリアルタイムの位置情報とルート案内を提供します。</p>
        </div>
      </CardContent>
    </Card>
  );
}
