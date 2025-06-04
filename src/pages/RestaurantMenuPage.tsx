import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuItemCard, { MenuItemData } from '@/components/MenuItemCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { ArrowLeft, ShoppingCart, Star, Clock } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Placeholder data
const placeholderRestaurant = {
  id: '1',
  name: 'Pizza Heaven',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3595/3595458.png',
  address: '123 Pizza St, Flavor Town',
  rating: 4.5,
  openingHours: '11:00 AM - 10:00 PM',
  cuisine: 'Italian, Pizza',
  menu: {
    appetizers: [
      { id: 'm1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emElMjBhcHBldGl6ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', dietaryTags: ['Vegetarian'], hasCustomizations: true },
    ],
    mainCourses: [
      { id: 'm2', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', dietaryTags: ['Vegetarian'], hasCustomizations: true },
      { id: 'm3', name: 'Pepperoni Pizza', description: 'Pizza with pepperoni slices.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', hasCustomizations: false },
    ],
    desserts: [
       { id: 'm4', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey center.', price: 7.50, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwY2FrZXxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=300&q=60', dietaryTags: ['Vegetarian'], hasCustomizations: false },
    ]
  }
};

// Zod schema for customization form
const customizationSchema = z.object({
  size: z.string().min(1, "Please select a size"),
  extraToppings: z.array(z.string()).optional(),
});
type CustomizationFormData = z.infer<typeof customizationSchema>;


const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<typeof placeholderRestaurant | null>(null);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [currentItemForCustomization, setCurrentItemForCustomization] = useState<MenuItemData | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0); // Simplified cart count

  const { control, handleSubmit, reset } = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: { size: '', extraToppings: [] }
  });

  useEffect(() => {
    console.log('RestaurantMenuPage loaded for restaurant ID:', restaurantId);
    // Simulate API call
    setRestaurant(placeholderRestaurant); // In a real app, fetch based on restaurantId
  }, [restaurantId]);

  const handleAddToCart = (item: MenuItemData) => {
    console.log('Adding to cart:', item);
    setCartItemCount(prev => prev + 1);
    // Add to cart logic (e.g., using context or state management)
  };

  const handleCustomizeItem = (item: MenuItemData) => {
    console.log('Customizing item:', item);
    setCurrentItemForCustomization(item);
    reset({ size: '', extraToppings: [] }); // Reset form for new item
    setIsCustomizationDialogOpen(true);
  };

  const onCustomizationSubmit = (data: CustomizationFormData) => {
    console.log('Customization submitted:', data, 'for item:', currentItemForCustomization);
    if (currentItemForCustomization) {
      handleAddToCart({ ...currentItemForCustomization, customizations: data }); // Add customized item to cart
    }
    setIsCustomizationDialogOpen(false);
  };

  if (!restaurant) {
    return <div className="flex justify-center items-center h-screen">Loading restaurant menu...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2 text-xs px-1.5">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </NavigationMenu>
      </header>

      <main className="flex-grow bg-gray-50">
        <Card className="m-4 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4 p-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
              <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{restaurant.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{restaurant.cuisine}</CardDescription>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Star className="h-4 w-4 text-yellow-500" fill="currentColor" /> <span>{restaurant.rating}</span>
                <Clock className="h-4 w-4" /> <span>{restaurant.openingHours}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="mainCourses" className="container mx-auto px-4 py-2">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
            <TabsTrigger value="mainCourses">Main Courses</TabsTrigger>
            <TabsTrigger value="desserts">Desserts</TabsTrigger>
          </TabsList>
          
          {(Object.keys(restaurant.menu) as Array<keyof typeof restaurant.menu>).map(category => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-[calc(100vh-300px)]"> {/* Adjust height as needed */}
                <div className="space-y-4 p-1">
                  {restaurant.menu[category].map((item: MenuItemData) => (
                    <MenuItemCard
                      key={item.id}
                      {...item}
                      onAddToCart={item.hasCustomizations ? () => handleCustomizeItem(item) : () => handleAddToCart(item)}
                      onCustomize={item.hasCustomizations ? () => handleCustomizeItem(item) : undefined}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {currentItemForCustomization && (
        <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize {currentItemForCustomization.name}</DialogTitle>
              <DialogDescription>
                Make selections for your item. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCustomizationSubmit)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="size">Size</Label>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="size-small" />
                        <Label htmlFor="size-small">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="size-medium" />
                        <Label htmlFor="size-medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="size-large" />
                        <Label htmlFor="size-large">Large</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                 {/* Example: errors.size && <p className="text-red-500 text-xs">{errors.size.message}</p> */}
              </div>
              <div className="grid gap-2">
                <Label>Extra Toppings</Label>
                <Controller
                    name="extraToppings"
                    control={control}
                    render={({ field }) => (
                        <>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="topping-cheese"
                                      checked={field.value?.includes('extra-cheese')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), 'extra-cheese'])
                                          : field.onChange(field.value?.filter((v) => v !== 'extra-cheese'));
                                      }}/>
                            <Label htmlFor="topping-cheese">Extra Cheese (+$1.00)</Label>
                          </div>
                           <div className="flex items-center space-x-2">
                            <Checkbox id="topping-olives"
                                      checked={field.value?.includes('olives')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), 'olives'])
                                          : field.onChange(field.value?.filter((v) => v !== 'olives'));
                                      }}/>
                            <Label htmlFor="topping-olives">Olives (+$0.50)</Label>
                          </div>
                        </>
                    )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save & Add to Cart</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
       <Button
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        size="lg"
        onClick={() => navigate('/cart')}
      >
        <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({cartItemCount})
      </Button>
    </div>
  );
};

export default RestaurantMenuPage;