import { cn } from '@/lib/utils';

export default function AvailabilityPicker({
    value,
    onChange,
}: {
    value: boolean;
    onChange: (available: boolean) => void;
}) {
    return (
        <div className="flex gap-2" role="radiogroup" aria-label="Donor status">
            <button
                type="button"
                role="radio"
                aria-checked={value}
                onClick={() => onChange(true)}
                className={cn(
                    'flex-1 rounded-md border-2 py-3 text-center transition',
                    value ? 'border-blood bg-blood-tint' : 'border-line bg-white',
                )}
            >
                <div className="mx-auto mb-1.5 h-2.5 w-2.5 rounded-full bg-good" />
                <div className="text-[12.5px] font-semibold text-ink">Available</div>
            </button>
            <button
                type="button"
                role="radio"
                aria-checked={!value}
                onClick={() => onChange(false)}
                className={cn(
                    'flex-1 rounded-md border-2 py-3 text-center transition',
                    !value ? 'border-ink-soft bg-line-soft' : 'border-line bg-white',
                )}
            >
                <div className="mx-auto mb-1.5 h-2.5 w-2.5 rounded-full bg-ink-mute" />
                <div className="text-[12.5px] font-semibold text-ink">Not Available</div>
            </button>
        </div>
    );
}
