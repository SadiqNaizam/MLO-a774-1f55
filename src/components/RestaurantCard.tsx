import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Clock, Tag } from 'lucide-react'; // Tag for sponsored, Clock for delivery
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "20-30 min"
  priceRange?: string; // e.g., "$$"
  isSponsored?: boolean;
  onClick: (id: string) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  priceRange,
  isSponsored = false,
  onClick,
  className,
}) => {
  console.log(`Rendering RestaurantCard: ${name}, ID: ${id}`);

  const handleCardClick = () => {
    console.log(`RestaurantCard clicked: ${name}, ID: ${id}`);
    onClick(id);
  };

  return (
    <Card
      className={cn("w-full overflow-hidden transition-shadow duration-200 hover:shadow-md cursor-pointer", className)}
      onClick={handleCardClick}
      tabIndex={0} // Make it focusable
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()} // Make it accessible via keyboard
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        {isSponsored && (
          <Badge variant="destructive" className="absolute top-2 right-2 flex items-center">
            <Tag className="h-3 w-3 mr-1" /> Sponsored
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
        <div className="text-xs text-gray-500 truncate">
          {cuisineTypes.slice(0, 3).join(' • ')}{cuisineTypes.length > 3 ? '...' : ''}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-700">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span>{rating.toFixed(1)}</span>
            {priceRange && <span className="mx-1">•</span>}
            {priceRange && <span>{priceRange}</span>}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;