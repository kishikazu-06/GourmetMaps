import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PlusCircle, XCircle } from "lucide-react";

// Marker icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const menuSchema = z.object({
  name: z.string().min(1, "メニュー名は必須です"),
  price: z.coerce.number().min(0, "価格は0以上で入力してください").optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "店名は必須です"),
  genre: z.string().min(1, "ジャンルは必須です"),
  address: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  hours: z.string().optional(),
  priceRange: z.string().optional(),
  imageUrl: z.string().url("無効なURLです").optional().or(z.literal('')),
  latitude: z.number(),
  longitude: z.number(),
  menus: z.array(menuSchema).optional(),
});

interface RestaurantRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const RestaurantRegistrationModal = ({ isOpen, onClose }: RestaurantRegistrationModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      genre: "",
      address: "",
      phone: "",
      description: "",
      hours: "",
      priceRange: "",
      imageUrl: "",
      latitude: 36.723216, // Default to a central point in Imizu
      longitude: 137.099571,
      menus: [{ name: "", price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "menus",
  });

  import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserCookie } from "@/hooks/use-user-cookie";
import { useToast } from "@/hooks/use-toast";

// ... (imports)

const RestaurantRegistrationModal = ({ isOpen, onClose }: RestaurantRegistrationModalProps) => {
  const queryClient = useQueryClient();
  const userCookie = useUserCookie();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    // ... (form setup)
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "menus",
  });

  const mutation = useMutation({
    mutationFn: (newRestaurant: z.infer<typeof formSchema>) => {
      return fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Cookie": userCookie || "",
        },
        body: JSON.stringify(newRestaurant),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      toast({ title: "お店を登録しました！" });
      onClose();
    },
    onError: (error) => {
      let errorMessage = "お店の登録に失敗しました";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message;
      }
      toast({ title: "エラー", description: errorMessage, variant: "destructive" });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  // ... (return statement with form)
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>お店を登録</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>店名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ジャンル</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>住所</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>場所を選択</FormLabel>
                <div className="h-64 w-full mt-2">
                  <MapContainer center={[form.getValues("latitude"), form.getValues("longitude")]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker onLocationChange={(latlng) => {
                      form.setValue("latitude", latlng.lat);
                      form.setValue("longitude", latlng.lng);
                    }} />
                  </MapContainer>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">メニュー情報</h3>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`menus.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="メニュー名" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`menus.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="価格" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", price: 0 })} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                メニューを追加
              </Button>
            </div>

            <Button type="submit">お店を登録する</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantRegistrationModal;
