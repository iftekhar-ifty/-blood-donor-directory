import { cn } from '@/lib/utils';

const AVATAR_STYLES = [
    'bg-[#FBE7E9] text-[#9A1227]',
    'bg-[#E8F0FB] text-[#1E4D8C]',
    'bg-[#FBF3E7] text-[#8C4F0B]',
    'bg-[#EAF3EA] text-[#1B7A4A]',
];

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export default function DonorAvatar({
    name,
    className,
    textClassName,
}: {
    name: string;
    className?: string;
    textClassName?: string;
}) {
    const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const style = AVATAR_STYLES[hash % AVATAR_STYLES.length];

    return (
        <div
            aria-hidden="true"
            className={cn(
                'flex items-center justify-center rounded-full font-bold',
                style,
                className,
            )}
        >
            <span className={cn(textClassName)}>{initials(name)}</span>
        </div>
    );
}
