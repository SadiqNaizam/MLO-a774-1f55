import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { ArrowLeft, CreditCard, Package } from 'lucide-react';

// Zod schema for checkout form
const checkoutSchema = z.object({
  deliveryAddress: z.string().min(1, "Please select or enter a delivery address."),
  newAddressStreet: z.string().optional(),
  newAddressCity: z.string().optional(),
  newAddressZip: z.string().optional(),
  paymentMethod: z.string().min(1, "Please select a payment method."),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions."),
  contactlessDelivery: z.boolean().optional(),
});
type CheckoutFormData = z.infer<typeof checkoutSchema>;

const savedAddresses = [
  { id: 'addr1', label: 'Home - 123 Main St, Anytown, USA' },
  { id: 'addr2', label: 'Work - 456 Office Ave, Anytown, USA' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isOrderPlacedAlertOpen, setIsOrderPlacedAlertOpen] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: '',
      paymentMethod: '',
      agreeToTerms: false,
      contactlessDelivery: false,
    }
  });

  const selectedAddress = watch('deliveryAddress');

  useEffect(() => {
    console.log('CheckoutPage loaded');
    if (selectedAddress === 'new') {
      setShowNewAddressForm(true);
    } else {
      setShowNewAddressForm(false);
    }
  }, [selectedAddress]);
  
  const onSubmit = (data: CheckoutFormData) => {
    console.log('Checkout form submitted:', data);
    // Simulate API call for placing order
    setIsOrderPlacedAlertOpen(true);
  };

  const handleAlertConfirm = () => {
    setIsOrderPlacedAlertOpen(false);
    navigate('/orders/my-new-order-124/tracking'); // Navigate to a dummy order tracking page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
           <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-auto">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold mx-auto">Checkout</h1>
          <div className="w-10"></div>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side: Address and Payment */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader><CardTitle>Delivery Address</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="deliveryAddress"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select an address or add new" /></SelectTrigger>
                      <SelectContent>
                        {savedAddresses.map(addr => (
                          <SelectItem key={addr.id} value={addr.id}>{addr.label}</SelectItem>
                        ))}
                        <SelectItem value="new">Add New Address</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.deliveryAddress && <p className="text-red-500 text-xs">{errors.deliveryAddress.message}</p>}
                
                {showNewAddressForm && (
                  <div className="space-y-3 p-4 border rounded-md mt-2">
                    <h3 className="font-medium text-sm">New Address Details</h3>
                     <div>
                        <Label htmlFor="newAddressStreet">Street Address</Label>
                        <Controller name="newAddressStreet" control={control} render={({ field }) => <Input id="newAddressStreet" placeholder="123 Main St" {...field} />} />
                    </div>
                     <div>
                        <Label htmlFor="newAddressCity">City</Label>
                        <Controller name="newAddressCity" control={control} render={({ field }) => <Input id="newAddressCity" placeholder="Anytown" {...field} />} />
                    </div>
                     <div>
                        <Label htmlFor="newAddressZip">ZIP Code</Label>
                        <Controller name="newAddressZip" control={control} render={({ field }) => <Input id="newAddressZip" placeholder="12345" {...field} />} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                        <RadioGroupItem value="card" id="pay-card" />
                        <Label htmlFor="pay-card" className="flex items-center gap-2 cursor-pointer"><CreditCard className="h-5 w-5" /> Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                        <RadioGroupItem value="paypal" id="pay-paypal" />
                        <Label htmlFor="pay-paypal" className="flex items-center gap-2 cursor-pointer"><img src="https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png" alt="PayPal" className="h-6"/> PayPal</Label>
                      </div>
                       <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                        <RadioGroupItem value="cod" id="pay-cod" />
                        <Label htmlFor="pay-cod" className="flex items-center gap-2 cursor-pointer"><Package className="h-5 w-5" /> Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.paymentMethod && <p className="text-red-500 text-xs">{errors.paymentMethod.message}</p>}

                {watch('paymentMethod') === 'card' && (
                  <div className="space-y-3 pt-4 border-t mt-4">
                    <h3 className="font-medium text-sm">Card Details</h3>
                    <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Controller name="cardNumber" control={control} render={({ field }) => <Input id="cardNumber" placeholder="•••• •••• •••• ••••" {...field} />} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Controller name="cardExpiry" control={control} render={({ field }) => <Input id="cardExpiry" placeholder="MM/YY" {...field} />} />
                        </div>
                        <div>
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Controller name="cardCvc" control={control} render={({ field }) => <Input id="cardCvc" placeholder="•••" {...field} />} />
                        </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Order Summary & Place Order */}
          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {/* Placeholder summary - In a real app, this data would come from cart context/state */}
                <div className="flex justify-between text-sm"><span>Margherita Pizza x 1</span><span>$12.99</span></div>
                <div className="flex justify-between text-sm"><span>Garlic Bread x 2</span><span>$11.98</span></div>
                <Separator />
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>$24.97</span></div>
                <div className="flex justify-between text-sm"><span>Delivery Fee</span><span>$2.99</span></div>
                <div className="flex justify-between text-sm"><span>Taxes</span><span>$2.00</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>$29.96</span></div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-start space-x-2 w-full">
                  <Controller
                    name="contactlessDelivery"
                    control={control}
                    render={({ field }) => <Checkbox id="contactless" checked={field.value} onCheckedChange={field.onChange} />}
                  />
                  <Label htmlFor="contactless" className="text-sm font-normal">Opt for contactless delivery</Label>
                </div>
                 <div className="flex items-start space-x-2 w-full">
                   <Controller
                    name="agreeToTerms"
                    control={control}
                    render={({ field }) => <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">I agree to the <a href="/terms" className="text-primary hover:underline">terms and conditions</a>.</Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-xs w-full">{errors.agreeToTerms.message}</p>}

                <Button type="submit" size="lg" className="w-full">Place Order</Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>

      <AlertDialog open={isOrderPlacedAlertOpen} onOpenChange={setIsOrderPlacedAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Placed Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order has been confirmed. You will be redirected to the order tracking page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertConfirm}>Track Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CheckoutPage;