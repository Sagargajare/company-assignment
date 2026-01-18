import type { Slot } from '@/lib/store/bookingStore';

interface SlotCardProps {
  slot: Slot;
  isSelected?: boolean;
  onSelect: (slot: Slot) => void;
  disabled?: boolean;
}

export default function SlotCard({ slot, isSelected = false, onSelect, disabled = false }: SlotCardProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <button
      onClick={() => !disabled && onSelect(slot)}
      disabled={disabled || slot.status !== 'available'}
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md transform scale-[1.02]'
          : slot.status === 'available'
          ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              slot.status === 'available' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-semibold text-gray-600">
              {slot.status === 'available' ? 'Available' : 'Booked'}
            </span>
          </div>
          
          <div className="mb-1">
            <p className="text-lg font-bold text-gray-900">
              {formatTime(slot.start_time_user_tz || slot.start_time)}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(slot.start_time_user_tz || slot.start_time)}
            </p>
          </div>

          <p className="text-sm font-medium text-gray-700 mt-2">
            Coach: <span className="text-blue-600">{slot.coach_name}</span>
          </p>
        </div>

        {isSelected && (
          <div className="ml-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

