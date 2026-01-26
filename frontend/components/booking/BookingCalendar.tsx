import { useMemo } from 'react';
import type { Slot } from '@/lib/store/bookingStore';
import { useTranslation, type Language } from '@/hooks';
import SlotCard from './SlotCard';

interface BookingCalendarProps {
  slots: Slot[];
  slotsGroupedByDate?: Record<string, Slot[]>;
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
  isLoading?: boolean;
  error?: string | null;
  language?: Language;
}

export default function BookingCalendar({
  slots,
  slotsGroupedByDate,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
  error = null,
  language = 'en',
}: BookingCalendarProps) {
  const { t, formatDate, pluralize } = useTranslation(language);
  // Group slots by date if not already grouped
  const groupedSlots = useMemo(() => {
    if (slotsGroupedByDate && Object.keys(slotsGroupedByDate).length > 0) {
      return slotsGroupedByDate;
    }

    const grouped: Record<string, Slot[]> = {};
    slots.forEach((slot) => {
      const date = new Date(slot.start_time).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    // Sort dates
    const sortedDates = Object.keys(grouped).sort();
    const sortedGrouped: Record<string, Slot[]> = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    });

    return sortedGrouped;
  }, [slots, slotsGroupedByDate]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return t.today;
    } else if (isTomorrow) {
      return t.tomorrow;
    } else {
      return formatDate(date, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">{t.loadingSlots}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-8 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
        <p className="text-gray-600 text-lg font-medium">{t.noSlotsAvailable}</p>
        <p className="text-gray-500 text-sm mt-2">{t.pleasewait}</p>
      </div>
    );
  }

  const dates = Object.keys(groupedSlots).sort();

  return (
    <div className="space-y-8">
      {dates.map((date) => (
        <div key={date} className="space-y-4">
          <div className="border-b-2 border-gray-200 pb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {formatDateHeader(date)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {groupedSlots[date].length} {pluralize(groupedSlots[date].length, t.slotsText)} {t.available}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedSlots[date].map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={selectedSlot?.id === slot.id}
                onSelect={onSelectSlot}
                language={language}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

