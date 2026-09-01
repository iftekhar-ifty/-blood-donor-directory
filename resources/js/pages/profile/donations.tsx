import { Form, Head, usePage } from '@inertiajs/react';
import { Droplet, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BottomSheet from '@/components/donor/bottom-sheet';
import {
    formatDate,
    type Donation,
    type DonationType,
} from '@/components/donor/types';
import { store as storeDonationRoute } from '@/routes/donor/profile/donations';
import { cn } from '@/lib/utils';

const DONATION_TYPES: DonationType[] = ['Whole Blood', 'Platelets', 'Plasma'];

export default function ProfileDonations({
    donations,
    eligibility,
}: {
    donations: Donation[];
    eligibility: { eligible_now: boolean; next_eligible_date: string | null };
}) {
    const flash = (usePage().props as { flash?: { success?: string } }).flash;
    const [addOpen, setAddOpen] = useState(
        // "Add Donation Record" on the profile links here with ?add=1
        () => new URL(usePage().url, window.location.origin).searchParams.has('add'),
    );
    const [donationType, setDonationType] = useState<DonationType>('Whole Blood');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    const today = new Date().toISOString().slice(0, 10);

    return (
        <>
            <Head title="My Donations" />

            <div className="min-h-screen bg-page">
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white px-4 py-3">
                    <h1 className="text-[16px] font-semibold">My Donations</h1>
                    <button
                        type="button"
                        onClick={() => setAddOpen(true)}
                        className="flex items-center gap-1 text-[13px] font-semibold text-blood"
                        aria-label="Add donation"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                        Add
                    </button>
                </div>

                <div className="px-4 py-4">
                    {/* Summary */}
                    <div className="mb-4 rounded-lg border border-line bg-white p-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-[24px] font-bold text-ink">
                                    {donations.length}
                                </div>
                                <div className="text-[12px] text-ink-soft">
                                    Total Donations
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-[14px] font-semibold text-ink">
                                    {donations.length > 0
                                        ? formatDate(donations[0]?.donation_date)
                                        : '—'}
                                </div>
                                <div className="text-[12px] text-ink-soft">
                                    Last Donation
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                            <span className="text-[12.5px] text-ink-soft">
                                Next Eligible Donation
                            </span>
                            {eligibility.eligible_now ? (
                                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-good">
                                    <span className="h-1.5 w-1.5 rounded-full bg-good" />
                                    Eligible now
                                </span>
                            ) : (
                                <span className="font-mono text-[13px] font-semibold text-ink">
                                    {formatDate(eligibility.next_eligible_date)}
                                </span>
                            )}
                        </div>
                    </div>

                    {donations.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blood-tint">
                                <Droplet
                                    className="h-8 w-8 fill-blood text-blood"
                                    aria-hidden="true"
                                />
                            </div>
                            <h3 className="mb-1.5 text-[16px] font-semibold text-ink">
                                No donations recorded
                            </h3>
                            <p className="mx-auto mb-5 max-w-[260px] text-[13px] leading-relaxed text-ink-soft">
                                Your donation history will appear here after you
                                record your first donation.
                            </p>
                            <button
                                type="button"
                                onClick={() => setAddOpen(true)}
                                className="rounded-lg bg-blood px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blood-deep"
                            >
                                Add Donation
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                                Donation Timeline
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
                                {donations.map((donation) => (
                                    <div key={donation.id} className="relative pb-3.5 last:pb-0">
                                        <div className="absolute -left-[18px] top-2 h-3.5 w-3.5 rounded-full bg-blood ring-4 ring-page" />
                                        <div className="rounded-lg border border-line bg-white p-3.5">
                                            <div className="mb-1.5 flex items-center justify-between">
                                                <span className="font-mono text-[13px] font-semibold text-ink">
                                                    {formatDate(donation.donation_date)}
                                                </span>
                                                <span className="rounded bg-good-tint px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-good">
                                                    {donation.status}
                                                </span>
                                            </div>
                                            <div className="mb-2 text-[13px] text-ink">
                                                {donation.location}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-ink-mute">
                                                <span className="rounded bg-blood-tint px-1.5 py-0.5 font-medium text-blood">
                                                    {donation.donation_type}
                                                </span>
                                                {donation.hospital && (
                                                    <span>· {donation.hospital}</span>
                                                )}
                                            </div>
                                            {donation.notes && (
                                                <p className="mt-2 text-[12px] italic leading-relaxed text-ink-soft">
                                                    "{donation.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add donation sheet */}
            <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="Add Donation Record">
                <Form
                    {...storeDonationRoute.form()}
                    className="space-y-3"
                    resetOnSuccess
                    onSuccess={() => setAddOpen(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="donation_type" value={donationType} />

                            <div>
                                <label
                                    htmlFor="donation_date"
                                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                                >
                                    Donation Date *
                                </label>
                                <input
                                    id="donation_date"
                                    type="date"
                                    name="donation_date"
                                    required
                                    max={today}
                                    defaultValue={today}
                                    className="w-full rounded-md border border-line bg-white px-3 py-2.5 font-mono text-[14px] outline-none focus:border-blood"
                                />
                                {errors?.donation_date && (
                                    <p className="mt-1 text-[12px] text-blood">
                                        {errors.donation_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                                >
                                    Donation Location *
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="Chattogram Medical College"
                                    className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blood"
                                />
                                {errors?.location && (
                                    <p className="mt-1 text-[12px] text-blood">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            <div>
                                <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">
                                    Donation Type *
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    {DONATION_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setDonationType(type)}
                                            className={cn(
                                                'rounded-md border py-2.5 text-[12.5px] font-medium transition',
                                                donationType === type
                                                    ? 'border-blood bg-blood text-white'
                                                    : 'border-line bg-white text-ink',
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="hospital"
                                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                                >
                                    Hospital / Organization (optional)
                                </label>
                                <input
                                    id="hospital"
                                    type="text"
                                    name="hospital"
                                    placeholder="Hospital name"
                                    className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blood"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="notes"
                                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                                >
                                    Notes (optional)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    placeholder="Any notes about this donation..."
                                    className="w-full resize-none rounded-md border border-line bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blood"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full rounded-lg bg-blood py-3.5 text-[15px] font-semibold text-white transition hover:bg-blood-deep"
                            >
                                Save Donation Record
                            </button>
                        </>
                    )}
                </Form>
            </BottomSheet>
        </>
    );
}
