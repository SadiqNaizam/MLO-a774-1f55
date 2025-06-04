import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customizations?: string; // e.g., "Size: Large, Extra Cheese"
}

const initialCartItems: CartItem[] = [
  { id: 'm2', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60', customizations: 'Size: Medium' },
  { id: 'm1', name: 'Garlic Bread', price: 5.99, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emElMjBhcHBldGl6ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Or remove item if 0
    setCartItems(items =>
      items.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
    console.log(`Quantity for item ${itemId} changed to ${newQuantity}`);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    console.log(`Item ${itemId} removed from cart`);
  };

  const handleApplyPromo = () => {
    console.log('Applying promo code:', promoCode);
    // Implement promo code logic
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0; // Example fee
  const taxes = subtotal * 0.08; // Example tax rate
  const grandTotal = subtotal + deliveryFee + taxes;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-auto">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold mx-auto">Your Cart</h1>
          {/* Invisible placeholder to balance the auto margins or add other icons */}
          <div className="w-10"></div> 
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
              ) : (
                <ScrollArea className="h-[calc(100vh-400px)] pr-2"> {/* Adjust height */}
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <Card key={item.id} className="flex items-center p-3">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                        )}
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.customizations && <p className="text-xs text-gray-500">{item.customizations}</p>}
                          <p className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input type="number" value={item.quantity} readOnly className="w-12 h-7 text-center px-1" />
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-3 text-red-500 hover:text-red-700" onClick={() => handleRemoveItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any special requests for the restaurant..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button onClick={handleApplyPromo} disabled={!promoCode}>Apply</Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes (8%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CartPage;