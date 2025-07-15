import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import RestaurantRegistrationModal from "./restaurant-registration-modal";

const AddRestaurantButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className="h-12 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-5 w-5" />
        <span>店舗を登録</span>
      </Button>
      <RestaurantRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AddRestaurantButton;
