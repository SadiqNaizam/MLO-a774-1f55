import React, { useState, useEffect } from 'react';
import { useNavigate } Gfrom 'react-router-dom';
import LocationSearchBar from '@/components/LocationSearchBar';
import InteractiveFilterChip from '@/components/InteractiveFilterChip';
import RestaurantCard from '@/components/RestaurantCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Filter, Utensils, Tag } from 'lucide-react';

// Placeholder data
const initialRestaurants = [
  { id: '1', name: 'Pizza Heaven', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min', priceRange: '$$', isSponsored: true },
  { id: '2', name: 'Burger Joint', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Burgers', 'Fast Food'], rating: 4.2, deliveryTime: '20-30 min', priceRange: '$' },
  { id: '3', name: 'Sushi World', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min', priceRange: '$$$' },
];

const cuisineFilters = [
  { id: 'pizza', label: 'Pizza', icon: <Utensils /> },
  { id: 'burgers', label: 'Burgers', icon: <Utensils /> },
  { id: 'sushi', label: 'Sushi', icon: <Utensils /> },
  { id: 'indian', label: 'Indian', icon: <Utensils /> },
  { id: 'chinese', label: 'Chinese', icon: <Utensils /> },
  { id: 'offers', label: 'Offers', icon: <Tag /> },
];

const RestaurantListingPage = () => {
  const [restaurants, setRestaurants] = useState<typeof initialRestaurants>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RestaurantListingPage loaded');
    // Simulate API call
    setTimeout(() => {
      setRestaurants(initialRestaurants);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleLocationSearch = (location: string) => {
    console.log('Searching for location:', location);
    // Implement search logic
  };

  const handleUseCurrentLocation = () => {
    console.log('Using current location');
    // Implement use current location logic
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
    );
    console.log('Toggled filter:', filterId, 'Active filters:', activeFilters);
    // Implement filter logic
  };

  const handleRestaurantClick = (id: string) => {
    console.log('Navigating to restaurant with id:', id);
    navigate(`/restaurants/${id}/menu`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="/" className="text-2xl font-bold text-primary">FoodFleet</a>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/cart" className={navigationMenuTriggerStyle()}>
                Cart
              </NavigationMenuLink>
            </NavigationMenuItem>
             <NavigationMenuItem>
              <NavigationMenuLink href="/orders/my-order-123/tracking" className={navigationMenuTriggerStyle()}>
                My Orders
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Add Login/Account Button */}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="max-w-4xl mx-auto p-4">
          <LocationSearchBar
            onSearch={handleLocationSearch}
            onUseCurrentLocation={handleUseCurrentLocation}
            placeholder="Enter your delivery address"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Categories</h2>
            {/* <Button variant="ghost" size="sm"><Filter className="h-4 w-4 mr-1" /> All Filters</Button> */}
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-3">
              {cuisineFilters.map(filter => (
                <InteractiveFilterChip
                  key={filter.id}
                  label={filter.label}
                  icon={filter.icon}
                  isActive={activeFilters.includes(filter.id)}
                  onClick={() => handleFilterClick(filter.id)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Nearby Restaurants</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          )}
        </section>

        {!isLoading && restaurants.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => console.log('Load more restaurants')}>
              Load More
            </Button>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} FoodFleet Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantListingPage;