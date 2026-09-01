import { Head, router, usePage } from '@inertiajs/react';
import { ChevronRight, Clock, Droplet, Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BottomSheet from '@/components/donor/bottom-sheet';
import DonorAvatar from '@/components/donor/donor-avatar';
import { selectClass } from '@/components/donor/form-styles';
import {
    formatDate,
    type Donation,
    type OwnProfile,
    UNAVAILABLE_REASONS,
} from '@/components/donor/types';
import { availability as availabilityRoute, donations as donationsRoute, edit as editRoute } from '@/routes/donor/profile';
import { logout as logoutRoute } from '@/routes';
import { cn } from '@/lib/utils';

export default function ProfileIndex({
    user,
    donations,
}: {
    user: OwnProfile;
    donations: Donation[];
}) {
    const flash = (usePage().props as { flash?: { success?: string } }).flash;
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [reason, setReason] = useState(user.unavailable_reason ?? '');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    const setAvailability = (available: boolean, unavailableReason?: string) => {
        router.patch(
            availabilityRoute().url,
            {
                is_available: available,
                ...(available ? {} : { unavailable_reason: unavailableReason ?? reason }),
            },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="My Profile" />

            <div className="min-h-screen bg-page">
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white px-4 py-3">
                    <h1 className="text-[16px] font-semibold">My Profile</h1>
                    <a
                        href={editRoute().url}
                        className="flex items-center gap-1 text-[13px] font-semibold text-blood"
                    >
                        Edit
                    </a>
                </div>

                <div className="px-4 py-5">
                    {/* Identity */}
                    <div className="mb-5 flex flex-col items-center text-center">
                        <DonorAvatar
                            name={user.name}
                            className="mb-3 h-20 w-20 text-[24px]"
                        />
                        <h2 className="text-[19px] font-bold tracking-tight">
                            {user.name}
                        </h2>
                        <p className="mt-0.5 text-[13.5px] text-ink-soft">
                            @{user.username}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blood px-3 py-1 text-white">
                            <Droplet className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                            <span className="font-mono text-[14px] font-bold">
                                {user.blood_group}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-line bg-white p-3.5 text-center">
                            <div className="text-[22px] font-bold text-ink">
                                {user.donations_count}
                            </div>
                            <div className="mt-0.5 text-[11.5px] text-ink-soft">
                                Total Donations
                            </div>
                        </div>
                        <div className="rounded-lg border border-line bg-white p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                                <span
                                    className={
                                        user.available
                                            ? 'h-2 w-2 rounded-full bg-good'
                                            : 'h-2 w-2 rounded-full bg-ink-mute'
                                    }
                                />
                                <span
                                    className={
                                        user.available
                                            ? 'text-[13.5px] font-semibold text-good'
                                            : 'text-[13.5px] font-semibold text-ink-soft'
                                    }
                                >
                                    {user.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                            <div className="mt-1.5 text-[11.5px] text-ink-soft">
                                Current Status
                            </div>
                        </div>
                    </div>

                    {/* Availability toggle */}
                    <div className="mb-3 rounded-lg border border-line bg-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="text-[14px] font-semibold text-ink">
                                    Donation Availability
                                </div>
                                <div className="mt-0.5 text-[12px] text-ink-soft">
                                    Toggle when you can donate blood
                                </div>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={user.available}
                                aria-label={
                                    user.available
                                        ? 'Currently available, tap to become unavailable'
                                        : 'Currently unavailable, tap to become available'
                                }
                                onClick={() => setAvailability(!user.available)}
                                className={cn(
                                    'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                                    user.available ? 'bg-good' : 'bg-ink-mute',
                                )}
                            >
                                <span
                                    className={cn(
                                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                                        user.available && 'translate-x-5',
                                    )}
                                />
                            </button>
                        </div>
                        {!user.available && (
                            <div className="mt-3 border-t border-line-soft pt-3">
                                <label
                                    htmlFor="unavailable-reason"
                                    className="mb-1.5 block text-[12px] text-ink-soft"
                                >
                                    Reason (optional, kept private)
                                </label>
                                <select
                                    id="unavailable-reason"
                                    value={reason}
                                    onChange={(event) => {
                                        setReason(event.target.value);
                                        setAvailability(false, event.target.value);
                                    }}
                                    className={selectClass}
                                >
                                    <option value="">Select reason</option>
                                    {UNAVAILABLE_REASONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Quick links */}
                    <div className="mb-3 overflow-hidden rounded-lg border border-line bg-white">
                        <a
                            href={donationsRoute().url}
                            className="flex w-full items-center justify-between border-b border-line-soft px-4 py-3.5 text-left transition hover:bg-line-soft"
                        >
                            <div className="flex items-center gap-2.5">
                                <Clock className="h-4 w-4 text-blood" aria-hidden="true" />
                                <span className="text-[14px] font-medium text-ink">
                                    Donation History
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-ink-soft">
                                    {user.donations_count} donations
                                </span>
                                <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                            </div>
                        </a>
                        <a
                            href={`${donationsRoute().url}?add=1`}
                            className="flex w-full items-center justify-between border-b border-line-soft px-4 py-3.5 text-left transition hover:bg-line-soft"
                        >
                            <div className="flex items-center gap-2.5">
                                <Plus className="h-4 w-4 text-blood" aria-hidden="true" />
                                <span className="text-[14px] font-medium text-ink">
                                    Add Donation Record
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                        </a>
                        <a
                            href="/settings"
                            className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-line-soft"
                        >
                            <div className="flex items-center gap-2.5">
                                <Settings className="h-4 w-4 text-blood" aria-hidden="true" />
                                <span className="text-[14px] font-medium text-ink">
                                    Settings
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                        </a>
                    </div>

                    {/* Contact & location */}
                    <div className="mb-3 rounded-lg border border-line bg-white p-4">
                        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Contact & Location
                        </div>
                        <div className="space-y-2 text-[13.5px]">
                            <div className="flex justify-between gap-3">
                                <span className="shrink-0 text-ink-soft">Phone</span>
                                <span className="font-mono font-medium text-ink">
                                    {user.phone}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="shrink-0 text-ink-soft">Village</span>
                                <span className="text-right font-medium text-ink">
                                    {user.village ?? '—'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="shrink-0 text-ink-soft">Union</span>
                                <span className="text-right font-medium text-ink">
                                    {user.union ?? '—'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="shrink-0 text-ink-soft">Last Donation</span>
                                <span className="text-right font-medium text-ink">
                                    {formatDate(user.last_donation_date)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setLogoutOpen(true)}
                        className="w-full rounded-lg py-3 text-[13.5px] font-semibold text-blood transition hover:bg-blood-tint"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Logout confirm */}
            <BottomSheet
                open={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                title="Logout"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setLogoutOpen(false)}
                            className="flex-1 rounded-md border border-line py-3 text-[14px] font-medium text-ink hover:bg-line-soft"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => router.post(logoutRoute().url)}
                            className="flex-1 rounded-md bg-blood py-3 text-[14px] font-semibold text-white hover:bg-blood-deep"
                        >
                            Logout
                        </button>
                    </>
                }
            >
                <p className="text-center text-[13.5px] leading-relaxed text-ink-soft">
                    Are you sure you want to logout of your donor account?
                </p>
            </BottomSheet>
        </>
    );
}
