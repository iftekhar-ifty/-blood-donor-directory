import { BLOOD_GROUPS } from '@/components/donor/types';
import { cn } from '@/lib/utils';

export default function BloodGroupPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (bloodGroup: string) => void;
}) {
    return (
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Blood group">
            {BLOOD_GROUPS.map((group) => (
                <button
                    key={group}
                    type="button"
                    role="radio"
                    aria-checked={value === group}
                    onClick={() => onChange(group)}
                    className={cn(
                        'rounded-md border py-2.5 font-mono text-[14px] font-bold transition',
                        value === group
                            ? 'border-blood bg-blood text-white'
                            : 'border-line bg-white text-ink hover:border-blood/40',
                    )}
                >
                    {group}
                </button>
            ))}
        </div>
    );
}
