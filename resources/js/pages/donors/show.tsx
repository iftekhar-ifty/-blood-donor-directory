import { Head, usePage } from '@inertiajs/react';
import { Droplet, Phone } from 'lucide-react';
import { useState } from 'react';
import CallConfirmDialog from '@/components/donor/call-confirm-dialog';
import DonorAvatar from '@/components/donor/donor-avatar';
import DonorPageHeader from '@/components/donor/donor-page-header';
import { formatDate, type PublicDonor } from '@/components/donor/types';

export default function DonorsShow({ donor }: { donor: PublicDonor }) {
    // Donor cards link here with ?call=1 to open the call dialog directly
    const [callOpen, setCallOpen] = useState(
        () => new URL(usePage().url, window.location.origin).searchParams.has('call'),
    );

    return (
        <>
            <Head title={donor.name} />

            <div className="min-h-screen bg-page">
                <DonorPageHeader title="Donor Profile" />

                <div className="px-4 py-5">
                    {/* Identity */}
                    <div className="mb-5 flex flex-col items-center text-center">
                        <DonorAvatar
                            name={donor.name}
                            className="mb-3 h-20 w-20 text-[24px]"
                        />
                        <h2 className="text-[19px] font-bold tracking-tight">
                            {donor.name}
                        </h2>
                        <p className="mt-0.5 text-[13.5px] text-ink-soft">
                            @{donor.username}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blood px-3 py-1 text-white">
                            <Droplet className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                            <span className="font-mono text-[14px] font-bold">
                                {donor.blood_group}
                            </span>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-3 rounded-lg border border-line bg-white p-4">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Availability
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={
                                    donor.available
                                        ? 'h-2 w-2 rounded-full bg-good'
                                        : 'h-2 w-2 rounded-full bg-ink-mute'
                                }
                            />
                            <span
                                className={
                                    donor.available
                                        ? 'text-[14px] font-semibold text-good'
                                        : 'text-[14px] font-semibold text-ink-soft'
                                }
                            >
                                {donor.available
                                    ? 'Available for donation'
                                    : 'Currently unavailable'}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="mb-3 rounded-lg border border-line bg-white p-4">
                        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Location
                        </div>
                        <div className="space-y-2 text-[13.5px]">
                            <div className="flex justify-between">
                                <span className="text-ink-soft">Village</span>
                                <span className="font-medium text-ink">
                                    {donor.village ?? '—'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ink-soft">Union</span>
                                <span className="font-medium text-ink">
                                    {donor.union ?? '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Donation history */}
                    <div className="mb-4 rounded-lg border border-line bg-white p-4">
                        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Donation History
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-[22px] font-bold text-ink">
                                    {donor.donations_count}
                                </div>
                                <div className="text-[12px] text-ink-soft">
                                    Total Donations
                                </div>
                            </div>
                            <div>
                                {donor.last_donation_date ? (
                                    <>
                                        <div className="font-mono text-[14px] font-semibold text-ink">
                                            {formatDate(donor.last_donation_date)}
                                        </div>
                                        <div className="text-[12px] text-ink-soft">
                                            Last Donation
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-[14px] font-semibold text-ink-mute">
                                            —
                                        </div>
                                        <div className="text-[12px] text-ink-soft">
                                            Never Donated
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCallOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blood py-3.5 text-[15px] font-semibold text-white transition hover:bg-blood-deep active:scale-[0.99]"
                    >
                        <Phone className="h-5 w-5" aria-hidden="true" />
                        Call Donor
                    </button>

                    <p className="mt-3 px-4 text-center text-[11.5px] leading-relaxed text-ink-mute">
                        This is a public profile. Please contact the donor
                        respectfully and only for blood donation purposes.
                    </p>
                </div>
            </div>

            <CallConfirmDialog
                open={callOpen}
                name={donor.name}
                phone={donor.phone ?? ''}
                onClose={() => setCallOpen(false)}
            />
        </>
    );
}
