import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import BottomSheet from '@/components/donor/bottom-sheet';
import DonorPageHeader from '@/components/donor/donor-page-header';
import { formatDate } from '@/components/donor/types';
import { donations as donationsRoute, edit as editRoute } from '@/routes/donor/profile';
import { logout as logoutRoute } from '@/routes';

type SharedUser = {
    name: string;
    username: string;
    blood_group: string;
    last_donation_date: string | null;
};

export default function Settings() {
    const auth = usePage().props.auth as unknown as { user?: SharedUser } | undefined;
    const user = auth?.user;
    const [logoutOpen, setLogoutOpen] = useState(false);

    const rowClass =
        'flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-line-soft';
    const borderRowClass = `${rowClass} border-t border-line-soft`;

    const comingSoon = (what: string) => {
        toast.info(`${what} coming soon.`);
    };

    return (
        <>
            <Head title="Settings" />

            <div className="min-h-screen bg-page">
                <DonorPageHeader title="Settings" backHref="/profile" />

                <div className="space-y-4 px-4 py-4">
                    <section>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Account
                        </div>
                        <div className="overflow-hidden rounded-lg border border-line bg-white">
                            <Link href={editRoute().url} className={rowClass}>
                                <span className="text-[14px] font-medium text-ink">
                                    Edit Profile
                                </span>
                                <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => comingSoon('Password change')}
                                className={borderRowClass}
                            >
                                <span className="text-[14px] font-medium text-ink">
                                    Change Password
                                </span>
                                <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => comingSoon('Privacy settings')}
                                className={borderRowClass}
                            >
                                <span className="text-[14px] font-medium text-ink">
                                    Privacy Settings
                                </span>
                                <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                            </button>
                        </div>
                    </section>

                    <section>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Donation
                        </div>
                        <div className="overflow-hidden rounded-lg border border-line bg-white">
                            <Link href={donationsRoute().url} className={rowClass}>
                                <span className="text-[14px] font-medium text-ink">
                                    Donation History
                                </span>
                                <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                            </Link>
                            <div className="flex items-center justify-between border-t border-line-soft px-4 py-3">
                                <span className="text-[14px] font-medium text-ink">
                                    Last Donation
                                </span>
                                <span className="font-mono text-[13px] text-ink-soft">
                                    {user?.last_donation_date
                                        ? formatDate(user.last_donation_date)
                                        : 'None yet'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            About
                        </div>
                        <div className="overflow-hidden rounded-lg border border-line bg-white">
                            <div className="flex items-center justify-between px-4 py-3">
                                <span className="text-[14px] font-medium text-ink">
                                    App Version
                                </span>
                                <span className="font-mono text-[13px] text-ink-soft">1.0.0</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => comingSoon('Terms & conditions')}
                                className={borderRowClass}
                            >
                                <span className="text-[14px] font-medium text-ink">
                                    Terms & Conditions
                                </span>
                                <ChevronRight className="h-4 w-4 text-ink-mute" aria-hidden="true" />
                            </button>
                        </div>
                    </section>

                    <button
                        type="button"
                        onClick={() => setLogoutOpen(true)}
                        className="w-full rounded-lg border border-line bg-white py-3 text-[14px] font-semibold text-blood transition hover:bg-blood-tint"
                    >
                        Logout
                    </button>
                </div>
            </div>

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
