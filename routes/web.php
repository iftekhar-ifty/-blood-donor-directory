<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VillageController;
use Illuminate\Support\Facades\Route;

// Splash / welcome — authed users go straight to the directory
Route::get('/', [AuthController::class, 'welcome'])->name('home');

// Live username availability feedback for the register form
Route::get('username-check', [AuthController::class, 'checkUsername'])
    ->name('username.check');

// Village catalog grows as donors add their own — guests need this on the
// register form, so it is throttled rather than auth-gated
Route::post('villages', [VillageController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('villages.store');

Route::middleware(['auth'])->group(function () {
    // Donor directory
    Route::get('donors', [DonorController::class, 'index'])->name('donors.index');
    Route::get('donors/{user}', [DonorController::class, 'show'])
        ->whereUuid('user')
        ->name('donors.show');

    // Own donor profile
    Route::get('profile', [ProfileController::class, 'show'])->name('donor.profile.show');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('donor.profile.edit');
    Route::put('profile', [ProfileController::class, 'update'])->name('donor.profile.update');
    Route::patch('profile/availability', [ProfileController::class, 'toggleAvailability'])->name('donor.profile.availability');
    Route::get('profile/donations', [ProfileController::class, 'donations'])->name('donor.profile.donations');
    Route::post('profile/donations', [ProfileController::class, 'storeDonation'])->name('donor.profile.donations.store');

    // Settings (donor app variant)
    Route::inertia('settings', 'settings')->name('donor.settings');

    // The starter dashboard is not part of the donor app
    Route::redirect('dashboard', '/donors');
});

require __DIR__.'/settings.php';
