import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserCookie } from "@/hooks/use-user-cookie";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "メニュー名は必須です"),
  price: z.coerce.number().min(0, "価格は0以上で入力してください").optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("無効なURLです").optional().or(z.literal('')),
});

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  restaurantName: string;
}

const AddMenuModal = ({ isOpen, onClose, restaurantId, restaurantName }: AddMenuModalProps) => {
  const queryClient = useQueryClient();
  const userCookie = useUserCookie();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: undefined,
      description: "",
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (newMenuItem: z.infer<typeof formSchema>) => {
      return fetch(`/api/restaurants/${restaurantId}/menu-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Cookie": userCookie || "",
        },
        body: JSON.stringify(newMenuItem),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants", restaurantId] });
      toast({ title: "メニューを追加しました！" });
      onClose();
      form.reset();
    },
    onError: (error) => {
      let errorMessage = "メニューの追加に失敗しました";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{restaurantName} にメニューを追加</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メニュー名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 〇〇ラーメン" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>価格</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="例: 800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明 (任意)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例: 豚骨ベースの濃厚スープ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>画像URL (任意)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>追加</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuModal;
