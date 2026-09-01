import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export default function DonorPageHeader({
    title,
    back = true,
    action,
}: {
    title: string;
    back?: boolean;
    action?: ReactNode;
}) {
    return (
        <div className="sticky top-0 z-20 border-b border-line bg-white">
            <div className="flex items-center gap-2 px-2 py-3">
                {back && (
                    <button
                        type="button"
                        onClick={() => {
                            if (window.history.length > 1) {
                                router.back();
                            } else {
                                router.get('/donors');
                            }
                        }}
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
