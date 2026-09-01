<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered donor.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $validated = Validator::make($input, [
            'name' => ['required', 'string', 'max:150'],
            'username' => ['required', 'string', 'max:50', 'alpha_dash', 'unique:users,username'],
            'phone' => ['required', 'string', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:6', Password::default()],
            'blood_group' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'union_id' => ['nullable', 'integer', 'exists:unions,id'],
            'village_id' => [
                'nullable',
                'integer',
                Rule::exists('villages', 'id')->where('union_id', $input['union_id'] ?? null),
            ],
            'is_available' => ['boolean'],
        ])->validate();

        return User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'phone' => $validated['phone'],
            'password_hash' => Hash::make($validated['password']),
            'blood_group' => $validated['blood_group'],
            'union_id' => $validated['union_id'] ?? null,
            'village_id' => $validated['village_id'] ?? null,
            'is_available' => $validated['is_available'] ?? true,
        ]);
    }
}
