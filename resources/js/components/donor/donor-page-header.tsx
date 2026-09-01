import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { goBack } from '@/lib/back';

export default function DonorPageHeader({
    title,
    back = true,
    backHref = '/donors',
    action,
}: {
    title: string;
    back?: boolean;
    /** Where the back button goes when there is no in-app history (deep link / direct load) */
    backHref?: string;
    action?: ReactNode;
}) {
    return (
        <div className="sticky top-0 z-20 border-b border-line bg-white">
            <div className="flex items-center gap-2 px-2 py-3">
                {back && (
                    <button
                        type="button"
                        onClick={() => goBack(backHref)}
                        aria-label="Go back"
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-line-soft"
                    >
                        <ChevronLeft className="h-5 w-5 text-ink" aria-hidden="true" />
                    </button>
                )}
                <h1 className="text-[16px] font-semibold">{title}</h1>
                {action && <div className="ml-auto">{action}</div>}
            </div>
        </div>
    );
}
