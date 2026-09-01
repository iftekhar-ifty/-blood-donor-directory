import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export default function BottomSheet({
    open,
    onClose,
    title,
    children,
    footer,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeydown);

        return () => window.removeEventListener('keydown', onKeydown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="animate-backdrop-enter absolute inset-0 bg-black/40"
                onClick={onClose}
            />
            <div className="animate-sheet-enter relative flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-t-2xl bg-white">
                <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
                    <h2 className="text-[16px] font-semibold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-line-soft"
                    >
                        <X className="h-4 w-4 text-ink" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

                {footer && (
                    <div className="flex gap-2 border-t border-line bg-white px-4 py-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
