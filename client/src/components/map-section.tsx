import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Coffee, Utensils } from "lucide-react";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
        <div className="relative rounded-xl h-64 overflow-hidden">
          <MapContainer center={[36.78, 137.02]} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-xl z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* You can add Markers here for specific locations */}
          </MapContainer>
          
          {/* Overlay with restaurant markers */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary text-white shadow-lg">
              <MapPin className="w-3 h-3 mr-1" />
              射水市周辺
            </Badge>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenFullMap}
              className="bg-white/90 text-gray-800 hover:bg-white shadow-lg"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              拡大表示
            </Button>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">周辺の登録店舗</span>
            <span className="text-primary font-medium">9店舗</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <Utensils className="w-3 h-3 mr-1" />
              ラーメン店 2軒
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Coffee className="w-3 h-3 mr-1" />
              カフェ 1軒
            </Badge>
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              その他 6軒
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            地図をタップして各店舗への詳しいルート案内を確認できます
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
