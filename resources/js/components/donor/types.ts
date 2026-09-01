export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export type DonationType = 'Whole Blood' | 'Platelets' | 'Plasma';

export type PublicDonor = {
    id: string;
    name: string;
    username: string;
    blood_group: BloodGroup;
    village: string | null;
    union: string | null;
    upazila: string | null;
    available: boolean;
    last_donation_date: string | null;
    donations_count: number;
    phone?: string;
};

export type OwnProfile = {
    id: string;
    name: string;
    username: string;
    phone: string;
    blood_group: BloodGroup;
    village: string | null;
    village_id: number | null;
    union: string | null;
    union_id: number | null;
    upazila: string | null;
    available: boolean;
    unavailable_reason: string | null;
    last_donation_date: string | null;
    donations_count: number;
    referral_code: string | null;
    referrals_count?: number;
};

export type Donation = {
    id: string;
    donation_date: string;
    location: string;
    donation_type: DonationType;
    hospital: string | null;
    notes: string | null;
    status: string;
};

export type UpazilaOption = { id: number; name: string };

export type UnionOption = { id: number; upazila_id: number | null; name: string };

export type VillageOption = { id: number; union_id: number; name: string };

export const UNAVAILABLE_REASONS = [
    'Recently Donated',
    'Sick',
    'Traveling',
    'Personal Reason',
    'Other',
] as const;

export function formatDate(date: string | null | undefined): string {
    if (!date) {
        return '—';
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
