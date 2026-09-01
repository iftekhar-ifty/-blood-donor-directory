import { Form, Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import type { OwnProfile, UnionOption, VillageOption } from '@/components/donor/types';
import { update as updateRoute } from '@/routes/donor/profile';
import { cn } from '@/lib/utils';

export default function ProfileEdit({
    user,
    unions,
    villages,
}: {
    user: OwnProfile;
    unions: UnionOption[];
    villages: VillageOption[];
}) {
    const errors = (usePage().props as { errors?: Record<string, string> }).errors;
    const [bloodGroup, setBloodGroup] = useState<string>(user.blood_group);
    const [available, setAvailable] = useState(user.available);
    const [unionId, setUnionId] = useState(user.union_id ? String(user.union_id) : '');
    const [villageId, setVillageId] = useState(user.village_id ? String(user.village_id) : '');

    // Server-side validation errors surface after a failed submit
    useEffect(() => {
        if (Object.keys(errors ?? {}).length > 0) {
            toast.error('Please fix the highlighted fields.');
        }
    }, [errors]);

    return (
        <>
            <Head title="Edit Profile" />

            <div className="min-h-screen bg-page">
                <DonorPageHeader title="Edit Profile" />

                <Form
                    {...updateRoute.form()}
                    className="px-4 py-4"
                >
                    {({ processing }) => (
                        <>
                            <input type="hidden" name="blood_group" value={bloodGroup} />
                            <input type="hidden" name="is_available" value={available ? '1' : '0'} />

                            <div className={sectionLabelClass}>Personal Information</div>
                            <div className={cn(sectionCardClass, 'mb-4')}>
                                <div>
                                    <label htmlFor="name" className={labelClass}>
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={user.name}
                                        className={inputClass}
                                    />
                                    <InputError message={errors?.name} />
                                </div>
                                <div>
                                    <label htmlFor="phone" className={labelClass}>
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        required
                                        defaultValue={user.phone}
                                        className={`${inputClass} font-mono`}
                                    />
                                    <InputError message={errors?.phone} />
                                </div>
                                <div>
                                    <label htmlFor="username" className={labelClass}>
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        defaultValue={user.username}
                                        className={`${inputClass} font-mono`}
                                    />
                                    <InputError message={errors?.username} />
                                </div>
                            </div>

                            <div className={sectionLabelClass}>Blood Information</div>
                            <div className="mb-4 rounded-lg border border-line bg-white p-3.5">
                                <label className={cn(labelClass, 'mb-2')}>Blood Group</label>
                                <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />
                                <InputError message={errors?.blood_group} />
                            </div>

                            <div className={sectionLabelClass}>Location</div>
                            <div className={cn(sectionCardClass, 'mb-4')}>
                                <LocationSelects
                                    unions={unions}
                                    villages={villages}
                                    unionId={unionId}
                                    villageId={villageId}
                                    onUnionChange={setUnionId}
                                    onVillageChange={setVillageId}
                                />
                                <InputError message={errors?.village_id} />
                            </div>

                            <div className={sectionLabelClass}>Donor Status</div>
                            <div className="mb-4 rounded-lg border border-line bg-white p-3.5">
                                <AvailabilityPicker value={available} onChange={setAvailable} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={primaryButtonClass}
                            >
                                Save Changes
                            </button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
