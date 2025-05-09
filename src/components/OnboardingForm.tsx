"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";

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
// Use type-only import for DateRange
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "@/providers/theme-provider";

// Define travel type for type safety
type TravelType = "solo" | "couple" | "family" | "friends";

// Modified form schema to use date range
const formSchema = z.object({
  destination: z.string().min(2, "Please enter a valid destination"),
  duration: z.object({
    from: z.date({
      required_error: "Start date is required",
    }),
    to: z.date({
      required_error: "End date is required",
    }),
  }),
  type: z.enum(["solo", "couple", "family", "friends"] as const, {
    required_error: "Please select a travel type",
  }),
});

// Define the form data type
type TravelFormData = z.infer<typeof formSchema>;

// Travel option type
interface TravelOptionProps {
  value: TravelType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

// Define a global variable to check if Google Maps is loaded
declare global {
  interface Window {
    googleMapsLoaded?: boolean;
    google?: any;
    initGoogleMaps?: () => void;
  }
}

// Hook to load Google Maps script
function useGoogleMapsScript() {
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    // If the script is already loaded, set state to true
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Callback function when the script loads
    window.initGoogleMaps = () => {
      window.googleMapsLoaded = true;
      setIsLoaded(true);
    };

    // Create and append the script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the callback
      window.initGoogleMaps = undefined;

      // Optionally remove the script tag
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return isLoaded;
}

// Destination Input Component with Google Places Autocomplete
interface DestinationFieldProps {
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
}

const DestinationField: React.FC<DestinationFieldProps> = ({ field }) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(field.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const isGoogleMapsLoaded = useGoogleMapsScript();
  
  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!isGoogleMapsLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      componentRestrictions: { country: [] },
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        field.onChange(place.formatted_address);
        setInputValue(place.formatted_address);
      }
    });

    // Cleanup listener
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
        {theme.theme === "dark" ? (
          <img
            src="/icons/location-dark.png"
            className="h-[18px]"
            alt="Location icon"
          />
        ) : (
          <img
            src="/icons/location-light.png"
            className="h-[18px]"
            alt="Location icon"
          />
        )}
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
interface DateRangePickerProps {
  field: {
    value: DateRange | undefined;
    onChange: (date: DateRange | undefined) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLButtonElement>;
  };
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ field }) => {
  const today = new Date();
  const theme = useTheme();

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
          {theme.theme === "dark" ? (
            <img
              src="/icons/calendar-dark.png"
              className="h-[18px] w-[18px]"
              alt="Calendar icon"
            />
          ) : (
            <img
              src="/icons/calendar-light.png"
              className="h-[18px] w-[18px]"
              alt="Calendar icon"
            />
          )}
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
          {theme.theme === "dark" ? (
            <img
              src="/icons/arrow-down-dark.png"
              className="w-[18px]"
              alt="Arrow down"
            />
          ) : (
            <img
              src="/icons/arrow-down-light.png"
              className="w-[18px]"
              alt="Arrow down"
            />
          )}
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
const TravelTypeOption: React.FC<TravelOptionProps> = ({
  value,
  label,
  isSelected,
  onClick,
}) => {
  const theme = useTheme();

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
      {theme.theme === "dark" ? (
        <img
          src={`/icons/${value}-dark.png`}
          className="h-[18px]"
          alt={`${label} icon`}
        />
      ) : (
        <img
          src={`/icons/${value}-light.png`}
          className="h-[18px]"
          alt={`${label} icon`}
        />
      )}
      <FormLabel className="font-[500] text-[16px] text-primary cursor-pointer">
        {label}
      </FormLabel>
    </FormItem>
  );
};

// Mock API service
const travelApiService = {
  submitTravelPlan: async (
    data: TravelFormData
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("API call with data:", data);
        // Simulate successful response
        resolve({
          success: true,
          message: "Your travel plan has been created successfully!",
        });

        // To simulate an error, uncomment this and comment the above
        // reject(new Error("Network error. Please try again."));
      }, 1500);
    });
  },
};

// Main Form Component
const OnboardingForm: React.FC = () => {
  const [travelType, setTravelType] = useState<TravelType | "">("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

      // Call the mock API service
      const response = await travelApiService.submitTravelPlan(values);

      // Show success message
      toast(`${response.message}`);

      // You could redirect the user or reset the form here
      // form.reset();
      // router.push("/dashboard");
    } catch (error) {
      // Show error message
      toast(
        `${
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRadioChange(value: TravelType) {
    setTravelType(value);
    form.setValue("type", value);
  }

  const travelOptions: Array<{ value: TravelType; label: string }> = [
    { value: "solo", label: "Solo" },
    { value: "couple", label: "Couple" },
    { value: "family", label: "Family" },
    { value: "friends", label: "Friends" },
  ];

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
              {/* Destination Field with Google Places */}
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

              {/* Duration Field - Now using DateRange */}
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
            {isSubmitting ? (
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
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OnboardingForm;