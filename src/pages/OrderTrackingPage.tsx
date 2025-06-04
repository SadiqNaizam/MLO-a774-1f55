import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderStatusTracker, { OrderStatusKey } from '@/components/OrderStatusTracker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';

const sampleOrder = {
  id: 'my-new-order-124',
  items: [
    { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
    { name: 'Garlic Bread', quantity: 2, price: 5.99 },
  ],
  totalAmount: 29.96,
  restaurantName: 'Pizza Heaven',
  estimatedDeliveryTime: '30-40 minutes',
  currentStatus: 'PREPARING' as OrderStatusKey,
  timestamps: {
    CONFIRMED: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString(), // 10 mins ago
    PREPARING: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString(), // 2 mins ago
  }
};

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState(sampleOrder); // In a real app, fetch order by orderId
  const [progressValue, setProgressValue] = useState(33); // Initial progress

  useEffect(() => {
    console.log('OrderTrackingPage loaded for order ID:', orderId);
    // Simulate order status updates
    // setOrder(prevOrder => ({ ...prevOrder, id: orderId || prevOrder.id }));

    const statusProgression: OrderStatusKey[] = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = statusProgression.indexOf(order.currentStatus);

    if (currentIdx < statusProgression.length -1 && currentIdx !== -1) {
        const timer = setTimeout(() => {
            const nextStatus = statusProgression[currentIdx + 1];
            setOrder(prev => ({
                ...prev,
                currentStatus: nextStatus,
                timestamps: {
                    ...prev.timestamps,
                    [nextStatus]: new Date().toLocaleTimeString()
                }
            }));
            setProgressValue(prev => Math.min(100, prev + 33));
        }, 15000); // Update every 15 seconds for demo
        return () => clearTimeout(timer);
    }

  }, [orderId, order.currentStatus]);

  const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
       <header className="sticky top-0 z-40 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
           <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-auto"> {/* Navigate to home or orders list */}
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold mx-auto">Track Order #{order.id.slice(-6)}</h1>
          <div className="w-10"></div>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Order Status: {order.currentStatus.replace('_', ' ')}</CardTitle>
            <CardDescription>
              Estimated Delivery: {order.estimatedDeliveryTime} from {order.restaurantName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OrderStatusTracker currentStatusKey={order.currentStatus} timestamps={order.timestamps} />
            <Progress value={progressValue} className="w-full mt-4" />
          </CardContent>
        </Card>

        <Card className="shadow-md">
            <CardHeader><CardTitle>Delivery Location</CardTitle></CardHeader>
            <CardContent>
                 <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
                    {/* Placeholder for map view */}
                    <img
                        src="https://images.unsplash.com/photo-1586500370958-001757595515?q=80&w=800&auto=format&fit=crop"
                        alt="Map placeholder showing a generic city map"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <p className="text-white text-lg font-medium">Live Map View (Coming Soon)</p>
                    </div>
                </AspectRatio>
            </CardContent>
        </Card>


        <Card className="shadow-md">
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {order.items.map(item => (
                <li key={item.name} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={() => console.log('Contact support for order:', order.id)}>
                <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
            </Button>
            {order.currentStatus === 'DELIVERED' && (
                 <Button className="w-full" onClick={() => console.log('Rate order:', order.id)}>
                    <Star className="mr-2 h-4 w-4" /> Rate Your Order
                </Button>
            )}
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;