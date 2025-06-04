import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming utils.ts for cn function

interface InteractiveFilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactElement;
  className?: string;
}

const InteractiveFilterChip: React.FC<InteractiveFilterChipProps> = ({
  label,
  isActive,
  onClick,
  icon,
  className,
}) => {
  console.log(`Rendering InteractiveFilterChip: ${label}, isActive: ${isActive}`);

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full h-8 px-3 text-sm transition-colors duration-150",
        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-gray-300 text-gray-700 hover:bg-gray-100",
        className
      )}
    >
      {icon && React.cloneElement(icon, { className: "mr-2 h-4 w-4" })}
      {label}
    </Button>
  );
};

export default InteractiveFilterChip;