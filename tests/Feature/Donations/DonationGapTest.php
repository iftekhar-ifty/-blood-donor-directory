<?php

namespace Tests\Feature\Donations;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DonationGapTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function future_dates_are_rejected(): void
    {
        $response = $this->actingAs($this->user)->post(route('donor.profile.donations.store'), [
            'donation_date' => now()->addDay()->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
        ]);

        $response->assertSessionHasErrors('donation_date');
        $this->assertDatabaseCount('donations', 0);
    }

    #[Test]
    public function missing_date_is_rejected(): void
    {
        $response = $this->actingAs($this->user)->post(route('donor.profile.donations.store'), [
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
        ]);

        $response->assertSessionHasErrors('donation_date');
    }

    #[Test]
    public function donation_within_75_days_of_previous_is_rejected_with_message(): void
    {
        Donation::create([
            'user_id' => $this->user->id,
            'donation_date' => now()->subDays(10)->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
            'status' => 'Completed',
        ]);

        $response = $this->actingAs($this->user)->post(route('donor.profile.donations.store'), [
            'donation_date' => now()->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
        ]);

        $response->assertSessionHasErrors('donation_date');

        $error = session('errors')->first('donation_date');
        $this->assertStringContainsString((string) Donation::MIN_DONATION_GAP_DAYS, $error);
        $this->assertDatabaseCount('donations', 1);
    }

    #[Test]
    public function donation_at_or_after_75_days_is_accepted(): void
    {
        Donation::create([
            'user_id' => $this->user->id,
            'donation_date' => now()->subDays(75)->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
            'status' => 'Completed',
        ]);

        $response = $this->actingAs($this->user)->post(route('donor.profile.donations.store'), [
            'donation_date' => now()->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
        ]);

        $response->assertRedirect(route('donor.profile.donations'));
        $this->assertDatabaseCount('donations', 2);
        $this->assertEquals(now()->toDateString(), $this->user->refresh()->last_donation_date->toDateString());
    }

    #[Test]
    public function backdated_entry_checks_gap_against_donation_dated_before_it(): void
    {
        // Latest overall donation is today; a backdated entry for last month
        // must be checked against the even older one (20 days before it), not today's
        Donation::create([
            'user_id' => $this->user->id,
            'donation_date' => now()->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
            'status' => 'Completed',
        ]);
        Donation::create([
            'user_id' => $this->user->id,
            'donation_date' => now()->subDays(95)->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
            'status' => 'Completed',
        ]);

        // 30 days after the 95-days-ago donation — within the 75-day gap, rejected
        $response = $this->actingAs($this->user)->post(route('donor.profile.donations.store'), [
            'donation_date' => now()->subDays(65)->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
        ]);

        $response->assertSessionHasErrors('donation_date');

        // 76 days after it — accepted even though it predates today's donation
        $response = $this->actingAs($this->user)->post(route('donor.profile.donations.store'), [
            'donation_date' => now()->subDays(19)->toDateString(),
            'location' => 'Noakhali General Hospital',
            'donation_type' => 'Whole Blood',
        ]);

        $response->assertRedirect(route('donor.profile.donations'));
        // 2 seeded + 1 backdated entry accepted (the within-gap one was rejected)
        $this->assertDatabaseCount('donations', 3);
    }

    #[Test]
    public function donations_page_receives_next_eligible_date(): void
    {
        $this->user->update(['last_donation_date' => now()->subDays(10)]);

        $response = $this->actingAs($this->user)->get(route('donor.profile.donations'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->where('eligibility.eligible_now', false)
                ->where('eligibility.next_eligible_date', now()->subDays(10)->copy()->addDays(75)->toDateString())
        );
    }
}
