import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Loader2, Bike, ChefHat, PackageCheck, XCircle, ClipboardList } from 'lucide-react'; // Icons for steps

export type OrderStatusKey = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface OrderStatusStep {
  key: OrderStatusKey;
  label: string;
  timestamp?: string; // ISO string or formatted string
  icon: React.ElementType;
}

const defaultStatuses: OrderStatusStep[] = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: ClipboardList },
  { key: 'PREPARING', label: 'Preparing Food', icon: ChefHat },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

const cancelledStatus: OrderStatusStep = { key: 'CANCELLED', label: 'Order Cancelled', icon: XCircle };
const pendingStatus: OrderStatusStep = { key: 'PENDING', label: 'Order Pending', icon: Loader2 }; // Example, might not be shown explicitly

interface OrderStatusTrackerProps {
  currentStatusKey: OrderStatusKey;
  statuses?: OrderStatusStep[]; // Allow custom statuses if needed
  timestamps?: Partial<Record<OrderStatusKey, string>>; // Map of status keys to timestamps
  className?: string;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatusKey,
  statuses = defaultStatuses,
  timestamps = {},
  className,
}) => {
  console.log(`Rendering OrderStatusTracker, current status: ${currentStatusKey}`);

  const activeStatuses = currentStatusKey === 'CANCELLED' ? [cancelledStatus] : statuses;
  const currentStatusIndex = activeStatuses.findIndex(s => s.key === currentStatusKey);

  return (
    <div className={cn("w-full space-y-4 sm:space-y-0 sm:flex sm:justify-between", className)}>
      {activeStatuses.map((step, index) => {
        const isCompleted = currentStatusKey === 'CANCELLED' ? step.key === 'CANCELLED' : index < currentStatusIndex;
        const isActive = step.key === currentStatusKey;
        const isFuture = index > currentStatusIndex && currentStatusKey !== 'CANCELLED';

        const StepIcon = step.icon;
        const iconColor = isActive || isCompleted ? 'text-primary' : 'text-gray-400';
        const textColor = isActive ? 'text-primary font-semibold' : isCompleted ? 'text-gray-700' : 'text-gray-500';

        return (
          <div key={step.key} className="flex items-center sm:flex-col sm:items-center sm:flex-1 relative">
            {/* Connector Line (for sm screens and up) */}
            {index < activeStatuses.length - 1 && currentStatusKey !== 'CANCELLED' && (
              <div
                className={cn(
                  "hidden sm:block absolute top-1/2 left-1/2 w-full h-0.5 transform -translate-y-1/2",
                  isCompleted || isActive ? 'bg-primary' : 'bg-gray-300'
                )}
                style={{ top: 'calc(1.125rem / 2)', zIndex: -1 }} // Half of icon size (h-9 in icon container)
              />
            )}

            <div className="flex items-center sm:flex-col sm:text-center z-10 bg-background px-2 sm:px-0">
              <div className={cn("rounded-full p-1.5 mr-3 sm:mr-0 sm:mb-1.5", isActive ? 'bg-primary/10' : isCompleted ? 'bg-green-100' : 'bg-gray-100')}>
                {isActive && step.key !== 'DELIVERED' && step.key !== 'CANCELLED' ? (
                  <Loader2 className={cn("h-5 w-5 animate-spin", iconColor)} />
                ) : (
                  <StepIcon className={cn("h-5 w-5", iconColor, isCompleted && 'text-green-600')} />
                )}
              </div>
              <div>
                <p className={cn("text-xs font-medium", textColor)}>{step.label}</p>
                {timestamps[step.key] && (
                  <p className="text-xs text-gray-400">{timestamps[step.key]}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;