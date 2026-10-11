"use client";

import { useMemo, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type DatePickerProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

const weekdays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(left: Date, right: Date): boolean {
  return dateValue(left) === dateValue(right);
}

export function DatePicker({
  id,
  value,
  onValueChange,
  disabled,
  placeholder = "Seleccionar fecha",
}: DatePickerProps) {
  const selected = parseDate(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selected ?? new Date(),
  );
  const days = useMemo(() => {
    const first = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );
    const gridStart = new Date(first);
    gridStart.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      return day;
    });
  }, [visibleMonth]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        id={id}
        disabled={disabled}
        className="flex h-8 w-full cursor-pointer items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        <CalendarDays className="size-4 text-muted-foreground" />
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected
            ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
                selected,
              )
            : placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="start" className="z-50">
          <Popover.Popup className="w-72 rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg outline-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Mes anterior"
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
              >
                <ChevronLeft className="size-4" />
              </button>
              <strong className="text-sm capitalize">
                {new Intl.DateTimeFormat("es-MX", {
                  month: "long",
                  year: "numeric",
                }).format(visibleMonth)}
              </strong>
              <button
                type="button"
                aria-label="Mes siguiente"
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {weekdays.map((weekday) => (
                <span key={weekday} className="py-1 text-muted-foreground">
                  {weekday}
                </span>
              ))}
              {days.map((day) => {
                const isSelected = selected ? sameDay(day, selected) : false;
                const outside = day.getMonth() !== visibleMonth.getMonth();
                const today = sameDay(day, new Date());
                return (
                  <button
                    key={dateValue(day)}
                    type="button"
                    aria-label={new Intl.DateTimeFormat("es-MX", {
                      dateStyle: "long",
                    }).format(day)}
                    aria-current={today ? "date" : undefined}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      outside && "text-muted-foreground/50",
                      today && !isSelected && "border border-primary/50",
                      isSelected &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                    onClick={() => {
                      onValueChange(dateValue(day));
                      setVisibleMonth(day);
                      setOpen(false);
                    }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
