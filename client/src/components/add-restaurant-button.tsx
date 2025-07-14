import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import RestaurantRegistrationModal from "./restaurant-registration-modal";

const AddRestaurantButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-8 w-8" />
      </Button>
      <RestaurantRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AddRestaurantButton;
