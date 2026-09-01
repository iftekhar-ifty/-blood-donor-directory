<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\Union;
use App\Models\User;
use App\Models\Village;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DonorSeeder extends Seeder
{
    /**
     * Sample donors mirroring the UI mockup, plus a demo login account.
     */
    public function run(): void
    {
        $donors = [
            [
                'name' => 'Ayesha Siddiqua', 'username' => 'ayesha_siddiqua', 'phone' => '01612345678',
                'blood_group' => 'O+', 'union' => 'জয়াগ', 'village' => 'জয়াগ বাজার',
                'available' => true, 'reason' => null,
                'donations' => [
                    ['date' => '2026-08-12', 'location' => 'Noakhali General Hospital', 'type' => 'Whole Blood', 'hospital' => 'Noakhali General Hospital', 'notes' => 'For emergency surgery patient'],
                    ['date' => '2026-04-05', 'location' => 'Local Blood Donation Camp', 'type' => 'Whole Blood', 'hospital' => 'Red Crescent', 'notes' => null],
                ],
            ],
            [
                'name' => 'Md. Rahim Ahmed', 'username' => 'rahim_ahmed', 'phone' => '01711223344',
                'blood_group' => 'O+', 'union' => 'জয়াগ', 'village' => 'উত্তর জয়াগ',
                'available' => true, 'reason' => null,
                'donations' => [
                    ['date' => '2026-08-12', 'location' => 'Noakhali General Hospital', 'type' => 'Whole Blood', 'hospital' => null, 'notes' => null],
                ],
            ],
            [
                'name' => 'Abdul Karim', 'username' => 'abdul_karim', 'phone' => '01822334455',
                'blood_group' => 'A+', 'union' => 'বেগমগঞ্জ', 'village' => 'বেগমগঞ্জ বাজার',
                'available' => false, 'reason' => 'Recently Donated',
                'donations' => [
                    ['date' => '2026-07-20', 'location' => 'Begumganj Upazila Health Complex', 'type' => 'Whole Blood', 'hospital' => null, 'notes' => null],
                ],
            ],
            [
                'name' => 'Nusrat Jahan', 'username' => 'nusrat_jahan', 'phone' => '01988776655',
                'blood_group' => 'B+', 'union' => 'ছয়ানী', 'village' => 'ছয়ানী',
                'available' => true, 'reason' => null,
                'donations' => [
                    ['date' => '2026-06-03', 'location' => 'Chowmuhani Hospital', 'type' => 'Platelets', 'hospital' => null, 'notes' => null],
                ],
            ],
            [
                'name' => 'Tanvir Hasan', 'username' => 'tanvir_hasan', 'phone' => '01766554433',
                'blood_group' => 'AB+', 'union' => 'বিনোদপুর', 'village' => 'মাইজদী কোর্ট',
                'available' => true, 'reason' => null,
                'donations' => [],
            ],
            [
                'name' => 'Fahmida Akter', 'username' => 'fahmida_akter', 'phone' => '01622330011',
                'blood_group' => 'O-', 'union' => 'বিনোদপুর', 'village' => 'দৌলতগঞ্জ',
                'available' => false, 'reason' => 'Sick',
                'donations' => [
                    ['date' => '2025-11-15', 'location' => 'Noakhali General Hospital', 'type' => 'Whole Blood', 'hospital' => null, 'notes' => null],
                ],
            ],
            [
                'name' => 'Imran Hossain', 'username' => 'imran_hossain', 'phone' => '01566778899',
                'blood_group' => 'A-', 'union' => 'কাবিলপুর', 'village' => 'কাবিলপুর বাজার',
                'available' => true, 'reason' => null,
                'donations' => [
                    ['date' => '2026-09-01', 'location' => 'Senbagh Upazila Health Complex', 'type' => 'Whole Blood', 'hospital' => null, 'notes' => null],
                ],
            ],
            [
                'name' => 'Sadia Islam', 'username' => 'sadia_islam', 'phone' => '01799887766',
                'blood_group' => 'B-', 'union' => 'চাষীর হাট', 'village' => 'চাষীর হাট',
                'available' => false, 'reason' => 'Traveling',
                'donations' => [],
            ],
            [
                'name' => 'Rakibul Islam', 'username' => 'rakibul_islam', 'phone' => '01877553311',
                'blood_group' => 'O+', 'union' => 'সাহাপুর', 'village' => 'সাহাপুর',
                'available' => true, 'reason' => null,
                'donations' => [
                    ['date' => '2026-05-22', 'location' => 'Chatkhil Upazila Health Complex', 'type' => 'Whole Blood', 'hospital' => null, 'notes' => null],
                ],
            ],
            [
                'name' => 'Mitu Akter', 'username' => 'mitu_akter', 'phone' => '01933221100',
                'blood_group' => 'AB-', 'union' => 'চরবাটা', 'village' => 'চরবাটা বাজার',
                'available' => true, 'reason' => null,
                'donations' => [
                    ['date' => '2026-02-10', 'location' => 'Subarnachar Upazila Health Complex', 'type' => 'Plasma', 'hospital' => null, 'notes' => null],
                ],
            ],
        ];

        foreach ($donors as $data) {
            $union = Union::where('name', $data['union'])->first();
            $village = Village::where('name', $data['village'])->where('union_id', $union?->id)->first();

            $lastDonationDate = null;

            foreach ($data['donations'] as $donation) {
                $lastDonationDate = max($lastDonationDate ?? $donation['date'], $donation['date']);
            }

            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'phone' => $data['phone'],
                'password_hash' => Hash::make('password'),
                'blood_group' => $data['blood_group'],
                'union_id' => $union?->id,
                'village_id' => $village?->id,
                'is_available' => $data['available'],
                'unavailable_reason' => $data['reason'],
                'last_donation_date' => $lastDonationDate,
                'referral_code' => User::generateReferralCode(),
            ]);

            foreach ($data['donations'] as $donation) {
                Donation::create([
                    'user_id' => $user->id,
                    'donation_date' => $donation['date'],
                    'location' => $donation['location'],
                    'donation_type' => $donation['type'],
                    'hospital' => $donation['hospital'],
                    'notes' => $donation['notes'],
                    'status' => 'Completed',
                ]);
            }
        }
    }
}
