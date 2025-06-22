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
        <div className="relative rounded-xl h-64 overflow-hidden">
          {/* Google Maps Embed - 射水市周辺の地図 */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51904.45289275841!2d137.02051982167966!3d36.78003275000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff79d8f1c7a8f1b%3A0x2e7a5d5e8f5e8f5e!2z5bCE5rC05biC44CB5a-M5bGx55yM!5e0!3m2!1sja!2sjp!4v1640995200000!5m2!1sja!2sjp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
            title="射水市周辺の地図"
          />
          
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
