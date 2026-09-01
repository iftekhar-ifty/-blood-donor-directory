import { Phone } from 'lucide-react';
import { useEffect } from 'react';

export default function CallConfirmDialog({
    open,
    name,
    phone,
    onClose,
}: {
    open: boolean;
    name: string;
    phone: string;
    onClose: () => void;
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Call ${name}`}
        >
            <div
                className="animate-backdrop-enter absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="animate-dialog-enter relative w-full max-w-[320px] rounded-2xl bg-white p-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blood-tint">
                    <Phone className="h-7 w-7 text-blood" aria-hidden="true" />
                </div>
                <h3 className="mb-1 text-[16px] font-semibold">Call this donor?</h3>
                <p className="mb-1 text-[13px] text-ink-soft">
                    Their phone number will be dialed directly.
                </p>
                <p className="mb-4 font-mono text-[15px] font-bold">{phone}</p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-md border border-line py-2.5 text-[14px] font-medium text-ink hover:bg-line-soft"
                    >
                        Cancel
                    </button>
                    <a
                        href={`tel:${phone}`}
                        onClick={onClose}
                        className="flex-1 rounded-md bg-blood py-2.5 text-[14px] font-semibold text-white hover:bg-blood-deep"
                    >
                        Call Now
                    </a>
                </div>
            </div>
        </div>
    );
}
