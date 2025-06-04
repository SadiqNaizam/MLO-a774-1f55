import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, LocateFixed } from 'lucide-react';

interface LocationSearchBarProps {
  initialValue?: string;
  placeholder?: string;
  onSearch: (location: string) => void;
  onUseCurrentLocation: () => void;
  className?: string;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  initialValue = '',
  placeholder = "Enter delivery address",
  onSearch,
  onUseCurrentLocation,
  className,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("LocationSearchBar: Submitting search for", inputValue);
    onSearch(inputValue);
  };

  const handleCurrentLocationClick = () => {
    console.log("LocationSearchBar: Use current location clicked");
    onUseCurrentLocation();
  };

  console.log("Rendering LocationSearchBar, current value:", inputValue);

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-20 w-full" // Padding for icon and button
        />
      </div>
      <Button type="button" variant="outline" size="icon" onClick={handleCurrentLocationClick} aria-label="Use current location">
        <LocateFixed className="h-5 w-5" />
      </Button>
      {/* Hidden submit button for form submission on enter, or explicit search button if desired */}
      {/* <Button type="submit" className="hidden sm:inline-flex">Search</Button> */}
    </form>
  );
};

export default LocationSearchBar;