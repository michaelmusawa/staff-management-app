"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCalendar, FiX, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  mode?: "range" | "single";
  paramStart?: string;
  paramEnd?: string;
  placeholderStart?: string;
  placeholderEnd?: string;
  valueStart?: string;
  valueEnd?: string;
  onStartChange?: (date: string) => void;
  onEndChange?: (date: string) => void;
  defaultStart?: string | "today";
  defaultEnd?: string | "today";
};

export default function DateFilter({
  mode = "range",
  paramStart = mode === "single" ? "date" : "startDate",
  paramEnd = "endDate",
  placeholderStart = "Start date",
  placeholderEnd = "End date",
  valueStart: propValueStart,
  valueEnd: propValueEnd,
  onStartChange,
  onEndChange,
  defaultStart,
  defaultEnd,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isControlled =
    propValueStart !== undefined || propValueEnd !== undefined;
  const getToday = () => new Date().toISOString().split("T")[0];

  const resolvedDefaultStart =
    defaultStart === "today" ? getToday() : defaultStart;
  const resolvedDefaultEnd = defaultEnd === "today" ? getToday() : defaultEnd;

  // Convert string dates to Date objects
  const initialStart = isControlled
    ? propValueStart
      ? new Date(propValueStart)
      : null
    : searchParams.get(paramStart)
    ? new Date(searchParams.get(paramStart)!)
    : resolvedDefaultStart
    ? new Date(resolvedDefaultStart)
    : null;

  const initialEnd = isControlled
    ? propValueEnd
      ? new Date(propValueEnd)
      : null
    : mode === "range"
    ? searchParams.get(paramEnd)
      ? new Date(searchParams.get(paramEnd)!)
      : resolvedDefaultEnd
      ? new Date(resolvedDefaultEnd)
      : null
    : null;

  const [startDate, setStartDate] = useState<Date | null>(initialStart);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Sync with controlled props
  useEffect(() => {
    if (isControlled) {
      if (propValueStart !== undefined) {
        setStartDate(propValueStart ? new Date(propValueStart) : null);
      }
      if (propValueEnd !== undefined) {
        setEndDate(propValueEnd ? new Date(propValueEnd) : null);
      }
    }
  }, [propValueStart, propValueEnd, isControlled]);

  // Update URL when inputs change
  useEffect(() => {
    if (isControlled) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (startDate) {
      params.set(paramStart, startDate.toISOString().split("T")[0]);
    } else {
      params.delete(paramStart);
    }

    if (mode === "range") {
      if (endDate) {
        params.set(paramEnd, endDate.toISOString().split("T")[0]);
      } else {
        params.delete(paramEnd);
      }

      // Validate date range
      if (startDate && endDate && startDate > endDate) {
        setError("Start date cannot be later than end date");
      } else {
        setError(null);
      }
    }

    replace(`${pathname}?${params.toString()}`);
  }, [
    startDate,
    endDate,
    replace,
    pathname,
    searchParams,
    paramStart,
    paramEnd,
    mode,
    isControlled,
  ]);

  const handleStartChange = (date: Date | null) => {
    setStartDate(date);
    if (onStartChange)
      onStartChange(date ? date.toISOString().split("T")[0] : "");
  };

  const handleEndChange = (date: Date | null) => {
    setEndDate(date);
    if (onEndChange) onEndChange(date ? date.toISOString().split("T")[0] : "");
  };

  const clear = () => {
    setStartDate(null);
    setEndDate(null);
    setError(null);
    if (onStartChange) onStartChange("");
    if (onEndChange) onEndChange("");
  };

  const hasValue = startDate || endDate;

  // Custom input component for consistent styling
  const CustomInput = ({ value, onClick, placeholder }: any) => (
    <div className="relative w-full">
      <div
        onClick={onClick}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
          "hover:border-primary transition-colors"
        )}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <FiCalendar className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* START/SINGLE DATE */}
        <div className="relative w-full sm:max-w-[200px]">
          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
            {mode === "single" ? "Date" : "Start"}
          </Label>
          <DatePicker
            selected={startDate}
            onChange={handleStartChange}
            customInput={<CustomInput placeholder={placeholderStart} />}
            maxDate={mode === "range" && endDate ? endDate : undefined}
            popperPlacement="bottom-start"
            dateFormat="yyyy-MM-dd"
            onCalendarOpen={() => setIsCalendarOpen(true)}
            onCalendarClose={() => setIsCalendarOpen(false)}
          />
        </div>

        {/* RANGE INDICATOR */}
        {mode === "range" && (
          <div className="hidden sm:flex items-center justify-center mt-6">
            <div className="h-0.5 w-6 bg-border rounded-full" />
          </div>
        )}

        {/* END DATE (range only) */}
        {mode === "range" && (
          <div className="relative w-full sm:max-w-[200px]">
            <Label className="text-xs font-medium text-muted-foreground mb-1 block">
              End
            </Label>
            <DatePicker
              selected={endDate}
              onChange={handleEndChange}
              customInput={<CustomInput placeholder={placeholderEnd} />}
              minDate={startDate || undefined}
              popperPlacement="bottom-start"
              dateFormat="yyyy-MM-dd"
              onCalendarOpen={() => setIsCalendarOpen(true)}
              onCalendarClose={() => setIsCalendarOpen(false)}
            />
          </div>
        )}

        {/* CLEAR BUTTON */}
        {hasValue && (
          <div className="mt-6 sm:mt-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground"
            >
              <FiX className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* VALIDATION ERROR */}
      {error && (
        <div className="flex items-start gap-2 p-3 text-sm border border-destructive bg-destructive/5 rounded-lg">
          <FiAlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <span className="text-destructive">{error}</span>
        </div>
      )}
    </div>
  );
}
