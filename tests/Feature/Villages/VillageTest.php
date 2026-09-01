<?php

namespace Tests\Feature\Villages;

use App\Models\Union;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class VillageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function guests_can_create_villages(): void
    {
        // The register form's combobox needs this before the user has an account
        $union = Union::factory()->create();

        $response = $this->postJson(route('villages.store'), [
            'name' => 'নতুন গ্রাম',
            'union_id' => $union->id,
        ]);

        $response->assertCreated()
            ->assertJson([
                'union_id' => $union->id,
                'name' => 'নতুন গ্রাম',
            ]);
        $this->assertDatabaseHas('villages', ['name' => 'নতুন গ্রাম']);
    }

    #[Test]
    public function creating_a_new_village_requires_a_name_and_valid_union(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(route('villages.store'), ['union_id' => 999999])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'union_id']);

        $this->actingAs($user)
            ->postJson(route('villages.store'), ['name' => str_repeat('x', 101)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'union_id']);
    }

    #[Test]
    public function an_authenticated_user_can_create_a_missing_village(): void
    {
        $user = User::factory()->create();
        $union = Union::factory()->create();

        $response = $this->actingAs($user)->postJson(route('villages.store'), [
            'name' => '  বিনোদপুর  ',
            'union_id' => $union->id,
        ]);

        $response->assertCreated()
            ->assertJson([
                'union_id' => $union->id,
                'name' => 'বিনোদপুর',
            ]);

        $this->assertDatabaseHas('villages', [
            'union_id' => $union->id,
            'name' => 'বিনোদপুর',
        ]);
    }

    #[Test]
    public function posting_an_existing_village_name_returns_the_existing_record(): void
    {
        $user = User::factory()->create();
        $union = Union::factory()->create();
        $existing = Village::factory()->create([
            'union_id' => $union->id,
            'name' => 'বিনোদপুর',
        ]);

        $response = $this->actingAs($user)->postJson(route('villages.store'), [
            'name' => 'বিনোদপুর',
            'union_id' => $union->id,
        ]);

        $response->assertCreated();
        $this->assertEquals($existing->id, $response->json('id'));
        $this->assertEquals(1, Village::where('union_id', $union->id)->count());
    }

    #[Test]
    public function the_same_name_in_a_different_union_creates_a_separate_village(): void
    {
        $user = User::factory()->create();
        $unionA = Union::factory()->create();
        $unionB = Union::factory()->create();

        Village::factory()->create(['union_id' => $unionA->id, 'name' => 'চরবাটা']);

        $response = $this->actingAs($user)->postJson(route('villages.store'), [
            'name' => 'চরবাটা',
            'union_id' => $unionB->id,
        ]);

        $response->assertCreated();
        $this->assertEquals(2, Village::where('name', 'চরবাটা')->count());
    }
}
