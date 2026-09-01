<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    // GET / — splash / welcome screen
    public function welcome(Request $request)
    {
        if ($request->user()) {
            return redirect()->intended(route('donors.index'));
        }

        return Inertia::render('welcome');
    }

    // GET /username-check?username=xyz — live availability feedback on register
    public function checkUsername(Request $request)
    {
        $username = $request->query('username');

        if (! $username || strlen($username) < 3) {
            return response()->json(['status' => 'short']);
        }

        $exists = User::where('username', $username)->exists();

        return response()->json([
            'status' => $exists ? 'taken' : 'available',
        ]);
    }
}
