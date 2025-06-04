import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3 } from 'lucide-react'; // Edit3 for customize
import { cn } from '@/lib/utils';

// Simplified item structure for this example
export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  dietaryTags?: string[];
  hasCustomizations?: boolean;
}

interface MenuItemCardProps extends MenuItemData {
  onAddToCart: (item: MenuItemData) => void; // Simplified, full app might need quantity, customizations
  onCustomize?: (item: MenuItemData) => void;
  className?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  dietaryTags,
  hasCustomizations,
  onAddToCart,
  onCustomize,
  className,
}) => {
  console.log(`Rendering MenuItemCard: ${name}, ID: ${id}`);

  const itemData = { id, name, description, price, imageUrl, dietaryTags, hasCustomizations };

  const handleAddToCart = () => {
    console.log(`MenuItemCard: Add to cart clicked for ${name}`);
    onAddToCart(itemData);
  };

  const handleCustomize = () => {
    console.log(`MenuItemCard: Customize clicked for ${name}`);
    if (onCustomize) {
      onCustomize(itemData);
    }
  };

  return (
    <Card className={cn("flex flex-col sm:flex-row overflow-hidden w-full", className)}>
      {imageUrl && (
        <div className="sm:w-1/3 md:w-1/4 flex-shrink-0">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-32 sm:h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </div>
      )}
      <div className="flex flex-col flex-grow p-4">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-md font-semibold">{name}</CardTitle>
          {description && (
            <CardDescription className="text-xs text-gray-600 mt-1 line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          {dietaryTags && dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {dietaryTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>
              ))}
            </div>
          )}
          <p className="text-sm font-medium text-primary">${price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-0 mt-3 flex gap-2">
          {hasCustomizations && onCustomize ? (
            <Button variant="outline" size="sm" onClick={handleCustomize} className="flex-1">
              <Edit3 className="mr-1.5 h-4 w-4" /> Customize
            </Button>
          ) : null}
          <Button size="sm" onClick={handleAddToCart} className="flex-1">
            <PlusCircle className="mr-1.5 h-4 w-4" /> Add
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;