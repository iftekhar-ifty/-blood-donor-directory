import { Link } from '@inertiajs/react';
import { MapPin, Phone } from 'lucide-react';
import DonorAvatar from '@/components/donor/donor-avatar';
import { formatDate, type PublicDonor } from '@/components/donor/types';
import { show as donorShowRoute } from '@/routes/donors';
import { cn } from '@/lib/utils';

export default function DonorCard({ donor }: { donor: PublicDonor }) {
    return (
        <article
            className={cn(
                'donor-card relative rounded-lg border border-line bg-white p-3.5',
                donor.available && 'donor-card-available',
            )}
        >
            <div className="flex items-start gap-3">
                <DonorAvatar
                    name={donor.name}
                    className="h-11 w-11 flex-shrink-0 text-[13px]"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-semibold leading-tight text-ink">
                            {donor.name}
                        </h3>
                        <span className="flex-shrink-0 rounded bg-blood px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                            {donor.blood_group}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[12.5px] text-ink-soft">
                        <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">
                            {[donor.village, donor.union].filter(Boolean).join(', ') ||
                                'Location not set'}
                        </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px]">
                        <span className="flex items-center gap-1">
                            <span
                                className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    donor.available ? 'bg-good' : 'bg-ink-mute',
                                )}
                            />
                            <span
                                className={cn(
                                    'font-medium',
                                    donor.available ? 'text-good' : 'text-ink-soft',
                                )}
                            >
                                {donor.available ? 'Available' : 'Unavailable'}
                            </span>
                        </span>
                        <span className="text-line">·</span>
                        <span className="text-ink-soft">
                            {donor.last_donation_date
                                ? `Last: ${formatDate(donor.last_donation_date)}`
                                : 'Never donated'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex gap-2 border-t border-line-soft pt-3">
                <Link
                    href={donorShowRoute({ user: donor.id }).url}
                    className="flex-1 rounded-md border border-line py-2 text-center text-[12.5px] font-medium text-ink transition hover:bg-line-soft"
                >
                    View Profile
                </Link>
                <Link
                    href={`${donorShowRoute({ user: donor.id }).url}?call=1`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-blood py-2 text-[12.5px] font-semibold text-white transition hover:bg-blood-deep"
                >
                    <Phone className="h-3 w-3" aria-hidden="true" />
                    Call Donor
                </Link>
            </div>
        </article>
    );
}
