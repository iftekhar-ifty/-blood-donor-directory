<?php

namespace Database\Seeders;

use App\Models\Union;
use App\Models\Upazila;
use App\Models\Village;
use Illuminate\Database\Seeder;

class NoakhaliSeeder extends Seeder
{
    /**
     * Seed Noakhali district: the 9 upazilas, their unions, and starter
     * villages — compiled from the official district portal
     * (noakhali.gov.bd union list). The village catalog grows
     * organically as donors add their own.
     */
    public function run(): void
    {
        $this->seedUpazilas();
        $this->seedUnions();
        $this->seedVillages();
    }

    /**
     * The 9 upazilas of Noakhali district (Bengali names).
     */
    private function seedUpazilas(): void
    {
        $upazilas = [
            'নোয়াখালী সদর',
            'বেগমগঞ্জ',
            'চাটখিল',
            'সোনাইমুড়ি',
            'সেনবাগ',
            'কবিরহাট',
            'কোম্পানীগঞ্জ',
            'হাতিয়া',
            'সুবর্ণচর',
        ];

        foreach ($upazilas as $name) {
            Upazila::firstOrCreate(['name' => $name]);
        }
    }

    /**
     * The unions of Noakhali district (Bengali names), mapped to their
     * parent upazila.
     */
    private function seedUnions(): void
    {
        $unionsByUpazila = [
            'নোয়াখালী সদর' => [
                'চরমটুয়া', 'দাদপুর', 'নোয়ান্নই', 'বিনোদপুর', 'নোয়াখালী', 'ধর্মপুর',
                'এওজবালিয়া', 'কালাদরাপ', 'অশ্বদিয়া', 'নেওয়াজপুর', 'পূর্বচরমটুয়া', 'আন্ডার চর',
            ],
            'বেগমগঞ্জ' => [
                'আমানউল্যাপুর', 'গোপালপুর', 'কাদির হানিফ', 'জীরতলী', 'নোয়াখালী', 'আলাইয়ারপুর',
                'ছয়ানী', 'রাজগঞ্জ', 'একলাশপুর', 'বেগমগঞ্জ', 'মিরওয়ারিশপুর', 'নরোত্তমপুর',
                'দুর্গাপুর', 'কুতুবপুর', 'রসুলপুর', 'হাজীপুর', 'শরীফপুর', 'কাদিরপুর',
            ],
            'কোম্পানীগঞ্জ' => [
                'সিরাজপুর', 'চরপার্বতী', 'চরহাজারী', 'চরকাঁকড়া', 'চরফকিরা',
                'রামপুর', 'মুছাপুর', 'চর এলাহী',
            ],
            'সেনবাগ' => [
                'ছাতারপাইয়া', 'কেশারপাড়', 'ডমুরুয়া', 'কাদরা', 'অর্জুনতলা',
                'কাবিলপুর', 'মোহাম্মদপুর', 'বীজবাগ', 'নবীপুর',
            ],
            'চাটখিল' => [
                'সাহাপুর', 'রামনারায়নপুর', 'পরকোট', 'বদলকোট', 'মোহাম্মদপুর',
                'পাঁচগাঁও', 'হাটপকুরিয়া ঘাটলাবাগ', 'নোয়াখালা', 'খিলপাড়া',
            ],
            'হাতিয়া' => [
                'হরণী', 'চানন্দী', 'সুখচর', 'নলচিরা', 'চরঈশ্বর', 'চরকিং',
                'তমরদ্দি', 'সোনাদিয়া', 'বুড়িরচর', 'জাহাজমারা', 'নিঝুম দ্বীপ',
            ],
            'সোনাইমুড়ি' => [
                'জয়াগ', 'নদনা', 'চাষীর হাট', 'বারগাঁও', 'অম্বরনগর',
                'নাটেশ্বর', 'বজরা', 'সোনাপুর', 'দেওটি', 'আমিশাপাড়া',
            ],
            'সুবর্ণচর' => [
                'চরজব্বর', 'চরবাটা', 'চরক্লার্ক', 'চরওয়াপদা', 'চরজুবলী',
                'চর আমানউল্যাহ', 'পূর্বচরবাটা', 'মোহাম্মদপুর',
            ],
            'কবিরহাট' => [
                'নরোত্তমপুর', 'সুন্দলপুর', 'ধানসিঁড়ি', 'ঘোষবাগ',
                'চাপরাশিরহাট', 'ধানশালিক', 'বাটইয়া',
            ],
        ];

        foreach ($unionsByUpazila as $upazilaName => $unions) {
            $upazila = Upazila::firstOrCreate(['name' => $upazilaName]);

            foreach ($unions as $name) {
                Union::firstOrCreate(
                    ['name' => $name, 'upazila_id' => $upazila->id],
                );
            }
        }
    }

    /**
     * Starter villages grouped by union name.
     */
    private function seedVillages(): void
    {
        $villagesByUnion = [
            'বিনোদপুর' => ['মাইজদী কোর্ট', 'দৌলতগঞ্জ', 'সোনাপুর'],
            'নোয়াখালী' => ['নোয়াখালী বাজার', 'রাজগঞ্জ বাজার'],
            'জয়াগ' => ['জয়াগ বাজার', 'উত্তর জয়াগ'],
            'চাষীর হাট' => ['চাষীর হাট', 'পশ্চিম চাষীর হাট'],
            'বেগমগঞ্জ' => ['বেগমগঞ্জ বাজার', 'চৌমুহনী'],
            'ছয়ানী' => ['ছয়ানী', 'পূর্ব ছয়ানী'],
            'কাবিলপুর' => ['কাবিলপুর বাজার', 'দক্ষিণ কাবিলপুর'],
            'সাহাপুর' => ['সাহাপুর', 'উত্তর সাহাপুর'],
            'পাঁচগাঁও' => ['পাঁচগাঁও বাজার', 'মধ্যম পাঁচগাঁও'],
            'চর আমানউল্যাহ' => ['চর আমানউল্যাহ', 'পূর্ব চর আমানউল্যাহ'],
            'চরবাটা' => ['চরবাটা বাজার', 'নয়াবাজার'],
            'হরণী' => ['হরণী', 'পশ্চিম হরণী'],
            'সুখচর' => ['সুখচর বাজার', 'পূর্ব সুখচর'],
            'নরোত্তমপুর' => ['নরোত্তমপুর বাজার', 'কাজিরহাট'],
        ];

        foreach ($villagesByUnion as $unionName => $villages) {
            $union = Union::where('name', $unionName)->first();

            if (! $union) {
                continue;
            }

            foreach ($villages as $village) {
                Village::firstOrCreate([
                    'union_id' => $union->id,
                    'name' => $village,
                ]);
            }
        }
    }
}
