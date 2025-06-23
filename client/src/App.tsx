import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNavigation } from "./components/bottom-navigation";
import Home from "@/pages/home";
import Search from "@/pages/search";
import RestaurantDetail from "@/pages/restaurant-detail";
import Favorites from "@/pages/favorites";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:ml-64">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/restaurant/:id" component={RestaurantDetail} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/map" component={Home} />
          <Route path="/profile" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <BottomNavigation />
      <div className="pb-16 md:pb-0" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
