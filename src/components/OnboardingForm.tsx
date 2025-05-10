"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "@/providers/theme-provider";

// Types
type TravelType = "solo" | "couple" | "family" | "friends";

type TravelOption = {
  value: TravelType;
  label: string;
};

type FormFieldProps<T> = {
  field: {
    value: T;
    onChange: (value: T) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
};

// Google Maps type declarations
declare global {
  interface Window {
    googleMapsLoaded?: boolean;
    google?: any;
    initGoogleMaps?: () => void;
  }
}

// Form schema
const formSchema = z.object({
  destination: z.string().min(2, "Please enter a valid destination"),
  duration: z.object({
    from: z.date({ required_error: "Start date is required" }),
    to: z.date({ required_error: "End date is required" }),
  }),
  type: z.enum(["solo", "couple", "family", "friends"], {
    required_error: "Please select a travel type",
  }),
});

type TravelFormData = z.infer<typeof formSchema>;

// Travel options data
const travelOptions: TravelOption[] = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];

// Google Maps script loader hook
function useGoogleMapsScript() {
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    window.initGoogleMaps = () => {
      window.googleMapsLoaded = true;
      setIsLoaded(true);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      window.initGoogleMaps = undefined;
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return isLoaded;
}

// Mock API service
const travelApiService = {
  submitTravelPlan: async (data: TravelFormData): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("API call with data:", data);
        resolve({
          success: true,
          message: "Your travel plan has been created successfully!",
        });
      }, 1500);
    });
  },
};

// Component for themed icons
const ThemedIcon = ({ name, alt }: { name: string; alt: string }) => {
  const { theme } = useTheme();
  return (
    <img
      src={`/icons/${name}-${theme === "dark" ? "dark" : "light"}.png`}
      className="h-[18px]"
      alt={alt}
    />
  );
};

// Destination Input Component with Google Places Autocomplete
const DestinationField = ({ field }: FormFieldProps<string>) => {
  const [inputValue, setInputValue] = useState(field.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const isGoogleMapsLoaded = useGoogleMapsScript();
  
  useEffect(() => {
    if (!isGoogleMapsLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      componentRestrictions: { country: [] },
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place?.formatted_address) {
        field.onChange(place.formatted_address);
        setInputValue(place.formatted_address);
      }
    });

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded, field]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    field.onChange(value);
  };

  return (
    <>
      <div className="flex w-full p-[10px] border-secondary border-[1px] gap-[10px] bg-primary-foreground rounded-[8px] items-center">
        <ThemedIcon name="location" alt="Location icon" />
        <Input
          ref={inputRef}
          placeholder={isGoogleMapsLoaded ? "Enter destination" : "Loading Google Maps..."}
          className="font-[500] text-[16px] w-full"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={field.onBlur}
          name={field.name}
          disabled={!isGoogleMapsLoaded}
        />
      </div>
      {!isGoogleMapsLoaded && (
        <p className="text-xs text-muted-foreground">Loading Google Maps search...</p>
      )}
    </>
  );
};

// Date Range Picker Component
const DateRangePicker = ({ field }: FormFieldProps<DateRange | undefined>) => {
  const today = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full cursor-pointer !border-secondary !border-[1px] flex justify-start p-[10px] gap-[10px] h-full font-[500] text-[16px] text-white !bg-primary-foreground",
            !field.value && "text-muted-foreground"
          )}
        >
          <ThemedIcon name="calendar" alt="Calendar icon" />
          {field.value?.from ? (
            field.value.to ? (
              <span className="text-primary w-full text-left">
                {format(field.value.from, "MMM d, yyyy")} -{" "}
                {format(field.value.to, "MMM d, yyyy")}
              </span>
            ) : (
              <span className="text-primary w-full text-left">
                {format(field.value.from, "MMM d, yyyy")}
              </span>
            )
          ) : (
            <span className="text-primary w-full text-left">
              Select duration
            </span>
          )}
          <ThemedIcon name="arrow-down" alt="Arrow down" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date < today}
          initialFocus
          numberOfMonths={1}
          defaultMonth={today}
        />
      </PopoverContent>
    </Popover>
  );
};

// Travel Type Option Component
const TravelTypeOption = ({
  value,
  label,
  isSelected,
  onClick,
}: {
  value: TravelType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <FormItem
      onClick={onClick}
      className={`flex items-center border-secondary gap-[10px] border-[1px] justify-center p-[10px] bg-primary-foreground rounded-[8px] cursor-pointer ${
        isSelected ? "border-2 border-primary" : ""
      }`}
    >
      <FormControl>
        <RadioGroupItem
          value={value}
          className="appearance-none absolute -left-[9999px] invisible"
        />
      </FormControl>
      <ThemedIcon name={value} alt={`${label} icon`} />
      <FormLabel className="font-[500] text-[16px] text-primary cursor-pointer">
        {label}
      </FormLabel>
    </FormItem>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center gap-2">
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Processing...
  </div>
);

// Main Form Component
const OnboardingForm = () => {
  const [travelType, setTravelType] = useState<TravelType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<TravelFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      duration: {
        from: undefined,
        to: undefined,
      },
    },
  });

  async function onSubmit(values: TravelFormData) {
    try {
      setIsSubmitting(true);
      const response = await travelApiService.submitTravelPlan(values);
      toast(response.message);
      if (response.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRadioChange(value: TravelType) {
    setTravelType(value);
    form.setValue("type", value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-background font-montserrat flex flex-col items-center justify-between h-screen py-[79px] px-5">
          <div className="w-full h-auto flex flex-col gap-[36px]">
            {/* Header Section */}
            <div className="w-full h-auto flex flex-col gap-[2px]">
              <h1 className="text-[24px] font-[800] text-primary">
                Plan Your Journey, Your Way!
              </h1>
              <p className="text-[14px] font-[400] text-primary">
                Let's create your personalised travel experience
              </p>
            </div>

            {/* Form Fields Section */}
            <div className="w-full h-auto flex flex-col gap-[28px]">
              {/* Destination Field */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="w-full h-auto flex flex-col gap-[10px]">
                    <FormLabel className="text-[18px] font-[700]">
                      Where would you like to go?
                    </FormLabel>
                    <FormControl>
                      <DestinationField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Field */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="w-full h-auto flex flex-col gap-[10px]">
                    <FormLabel className="text-[18px] font-[700]">
                      How long will you stay?
                    </FormLabel>
                    <FormControl>
                      <DateRangePicker field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Travel Type Field */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full h-auto flex flex-col gap-[10px]">
                    <FormLabel className="text-[18px] font-[700]">
                      Who are you traveling with?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-[10px]"
                      >
                        {travelOptions.map((option) => (
                          <TravelTypeOption
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={travelType === option.value}
                            onClick={() => handleRadioChange(option.value)}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[44px] hover:bg-blue/60 cursor-pointer bg-blue text-white text-[16px] font-[600]"
          >
            {isSubmitting ? <LoadingSpinner /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OnboardingForm;