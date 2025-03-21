"use client";

import { useState, useEffect, useRef } from "react";
import { format, parse, isValid } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  format?: string;
  inputFormat?: string;
  className?: string;
}

const DatePicker = ({
  date,
  onDateChange,
  placeholder = "Select date",
  disabled = false,
  disabledDates,
  format: outputFormat = "MMM yyyy",
  inputFormat = "dd-MM-yyyy",
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    date ? format(date, inputFormat) : ""
  );
  const [isValidDate, setIsValidDate] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default month should be the selected date, or current month if no date
  const defaultMonth = date ? new Date(date) : new Date();

  // Update input value when date prop changes
  useEffect(() => {
    if (date) {
      setInputValue(format(date, inputFormat));
      setIsValidDate(true);
    } else {
      setInputValue("");
    }
  }, [date, inputFormat]);

  // Try to parse a date string using multiple formats
  const tryParseDate = (value: string): Date | null => {
    // Supported formats
    const formats = [
      inputFormat, // e.g. "dd-MM-yyyy"
      "d-M-yyyy", // e.g. "5-1-2023"
      "dd/MM/yyyy", // e.g. "15/01/2023"
      "d/M/yyyy", // e.g. "5/1/2023"
      "yyyy-MM-dd", // e.g. "2023-01-15" (ISO format)
    ];

    // Try each format
    for (const fmt of formats) {
      try {
        const parsedDate = parse(value, fmt, new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch (error) {
        // Continue to next format
      }
    }

    return null;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse the entered date
    if (value) {
      const parsedDate = tryParseDate(value);

      if (parsedDate) {
        onDateChange(parsedDate);
        setIsValidDate(true);
      } else {
        setIsValidDate(false);
      }
    } else {
      // Empty input clears the date
      onDateChange(undefined);
      setIsValidDate(true);
    }
  };

  // Handle calendar selection
  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setInputValue(format(selectedDate, inputFormat));
      setIsValidDate(true);
    }
    setIsOpen(false);
  };

  // Handle input blur (apply formatting)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't close popover if clicking within the container
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }

    // Format date if valid
    if (date && isValidDate) {
      setInputValue(format(date, inputFormat));
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  // Handle click on the container
  const handleContainerClick = () => {
    if (!disabled && !isOpen) {
      setIsOpen(true);
      inputRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              isValidDate ? "" : "border-red-500",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={handleContainerClick}
          >
            <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              className={cn(
                "border-none p-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                !isValidDate && "text-red-500"
              )}
              disabled={disabled}
              onClick={(e) => e.stopPropagation()}
              aria-label="Date input"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarSelect}
            disabled={disabledDates}
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            defaultMonth={defaultMonth}
          />
        </PopoverContent>
      </Popover>
      {!isValidDate && (
        <p className="mt-1 text-xs text-red-500">Please enter a valid date</p>
      )}
    </div>
  );
};

export { DatePicker };
