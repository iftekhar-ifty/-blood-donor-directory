<?php

namespace Tests\Feature\Referral;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReferralTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function registration_without_referral_code_works(): void
    {
        $response = $this->post(route('register.store'), $this->registrationPayload());

        $this->assertAuthenticated();
        $user = auth()->user();

        $this->assertNotNull($user->referral_code);
        $this->assertNull($user->referred_by_user_id);
    }

    #[Test]
    public function registration_with_valid_referral_code_credits_the_referrer(): void
    {
        $referrer = User::factory()->create();

        $response = $this->post(route('register.store'), $this->registrationPayload([
            'referral_code' => $referrer->referral_code,
        ]));

        $this->assertAuthenticated();
        $user = auth()->user();

        $this->assertEquals($referrer->id, $user->referred_by_user_id);
        $this->assertEquals(1, $referrer->refresh()->referrals()->count());
        $this->assertNotEquals($referrer->referral_code, $user->referral_code);
    }

    #[Test]
    public function registration_with_invalid_referral_code_is_rejected(): void
    {
        $response = $this->post(route('register.store'), $this->registrationPayload([
            'referral_code' => 'NOPE1234',
        ]));

        $response->assertSessionHasErrors('referral_code');
        $this->assertGuest();
    }

    #[Test]
    public function every_user_gets_a_unique_referral_code(): void
    {
        $codes = User::factory()->count(20)->create()->pluck('referral_code');

        $this->assertCount(20, $codes->unique());
    }

    #[Test]
    public function profile_page_shows_code_and_referral_count(): void
    {
        $user = User::factory()->create();
        User::factory()->count(2)->create(['referred_by_user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('donor.profile.show'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->where('user.referral_code', $user->referral_code)
                ->where('user.referrals_count', 2)
        );
    }

    private function registrationPayload(array $overrides = []): array
    {
        return [
            'name' => 'Referred Donor',
            'username' => 'referred_donor',
            'phone' => '01700000001',
            'password' => 'password',
            'password_confirmation' => 'password',
            'blood_group' => 'O+',
            'is_available' => '1',
            ...$overrides,
        ];
    }
}
