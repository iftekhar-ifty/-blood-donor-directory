import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AvailabilityPicker from '@/components/donor/availability-picker';
import BloodGroupPicker from '@/components/donor/blood-group-picker';
import DonorPageHeader from '@/components/donor/donor-page-header';
import {
    inputClass,
    labelClass,
    primaryButtonClass,
    sectionCardClass,
    sectionLabelClass,
} from '@/components/donor/form-styles';
import InputError from '@/components/input-error';
import LocationSelects from '@/components/donor/location-selects';
import type { UnionOption, UpazilaOption, VillageOption } from '@/components/donor/types';
import { login as loginRoute } from '@/routes';
import { store as registerStore } from '@/routes/register';
import { check as usernameCheckRoute } from '@/routes/username';
import { cn } from '@/lib/utils';

type UsernameStatus = 'idle' | 'short' | 'taken' | 'available' | 'checking';

export default function Register({
    upazilas,
    unions,
    villages,
}: {
    upazilas: UpazilaOption[];
    unions: UnionOption[];
    villages: VillageOption[];
}) {
    const [bloodGroup, setBloodGroup] = useState('');
    const [available, setAvailable] = useState(true);
    const [unionId, setUnionId] = useState('');
    const [villageId, setVillageId] = useState('');
    const [knownVillages, setKnownVillages] = useState(villages);

    const [username, setUsername] = useState('');
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Shared referral links carry ?ref=CODE
    const prefilledReferralCode = new URL(usePage().url, window.location.origin)
        .searchParams.get('ref');

    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        if (!username) {
            setUsernameStatus('idle');

            return;
        }

        if (username.length < 3) {
            setUsernameStatus('short');

            return;
        }

        setUsernameStatus('checking');
        timer.current = setTimeout(() => {
            fetch(usernameCheckRoute({ query: { username } }).url, {
                headers: { Accept: 'application/json' },
            })
                .then((response) => response.json() as Promise<{ status: UsernameStatus }>)
                .then((data) => setUsernameStatus(data.status))
                .catch(() => setUsernameStatus('idle'));
        }, 400);

        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [username]);

    return (
        <>
            <Head title="Become a Blood Donor" />

            <div className="min-h-screen bg-page">
                <DonorPageHeader title="Become a Blood Donor" backHref="/" />

                <div className="px-4 py-4">
                    <p className="mb-5 text-[13.5px] leading-relaxed text-ink-soft">
                        Create your donor profile and help someone find the right
                        blood group when they need it.
                    </p>

                    <Form
                        {...registerStore.form()}
                        className="space-y-0"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="blood_group" value={bloodGroup} />
                                <input type="hidden" name="is_available" value={available ? '1' : '0'} />

                                <div className={sectionLabelClass}>
                                    Personal Information
                                </div>
                                <div className={cn(sectionCardClass, 'mb-4')}>
                                    <div>
                                        <label htmlFor="name" className={labelClass}>
                                            Full Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            placeholder="Md. Rahim Ahmed"
                                            className={inputClass}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className={labelClass}>
                                            Phone Number *
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="01XXXXXXXXX"
                                            className={`${inputClass} font-mono`}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div>
                                        <label htmlFor="username" className={labelClass}>
                                            Unique Username *
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            name="username"
                                            required
                                            value={username}
                                            onChange={(event) => setUsername(event.target.value)}
                                            placeholder="rahim_ahmed"
                                            className={cn(
                                                inputClass,
                                                'font-mono',
                                                usernameStatus === 'taken' && 'border-blood',
                                                usernameStatus === 'available' && 'border-good',
                                            )}
                                        />
                                        {usernameStatus === 'available' && (
                                            <p className="mt-1 flex items-center gap-1 text-[11.5px] text-good">
                                                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                                                Username available
                                            </p>
                                        )}
                                        {usernameStatus === 'taken' && (
                                            <p className="mt-1 flex items-center gap-1 text-[11.5px] text-blood">
                                                <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                                                Username already taken
                                            </p>
                                        )}
                                        <InputError message={errors.username} />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className={labelClass}>
                                            Password *
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoComplete="new-password"
                                            placeholder="Minimum 6 characters"
                                            className={inputClass}
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                </div>

                                <div className={sectionLabelClass}>
                                    Location Information
                                </div>
                                <div className={cn(sectionCardClass, 'mb-4')}>
                                    <LocationSelects
                                        upazilas={upazilas}
                                        unions={unions}
                                        villages={knownVillages}
                                        unionId={unionId}
                                        villageId={villageId}
                                        onUnionChange={setUnionId}
                                        onVillageChange={setVillageId}
                                        onVillageCreated={(village) =>
                                            setKnownVillages((current) => [...current, village])
                                        }
                                    />
                                </div>

                                <div className={sectionLabelClass}>Blood Information</div>
                                <div className="mb-4 rounded-lg border border-line bg-white p-3.5">
                                    <label className={cn(labelClass, 'mb-2')}>
                                        Blood Group *
                                    </label>
                                    <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />
                                    <InputError message={errors.blood_group} />
                                </div>

                                <div className={sectionLabelClass}>Donor Status</div>
                                <div className="mb-4 rounded-lg border border-line bg-white p-3.5">
                                    <p className="mb-1.5 text-[13.5px] font-medium text-ink">
                                        Are you currently available to donate blood?
                                    </p>
                                    <p className="mb-3 text-[12px] leading-relaxed text-ink-soft">
                                        People can see your availability when searching
                                        for donors.
                                    </p>
                                    <AvailabilityPicker value={available} onChange={setAvailable} />
                                </div>

                                <div className={sectionLabelClass}>Referral (optional)</div>
                                <div className="mb-4 rounded-lg border border-line bg-white p-3.5">
                                    <label htmlFor="referral_code" className={labelClass}>
                                        Referral Code
                                    </label>
                                    <input
                                        id="referral_code"
                                        type="text"
                                        name="referral_code"
                                        autoComplete="off"
                                        defaultValue={prefilledReferralCode ?? ''}
                                        placeholder="e.g. 7KD2M9XA"
                                        className={`${inputClass} font-mono uppercase`}
                                    />
                                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
                                        Did another donor invite you? Enter their code to
                                        credit them.
                                    </p>
                                    <InputError message={errors.referral_code} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={cn(primaryButtonClass, 'mb-3')}
                                >
                                    Create Donor Profile
                                </button>
                            </>
                        )}
                    </Form>

                    <Link
                        href={loginRoute().url}
                        className="block w-full py-2 text-center text-[13px] text-ink-soft"
                    >
                        Already have an account?{' '}
                        <span className="font-semibold text-blood">Login</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
