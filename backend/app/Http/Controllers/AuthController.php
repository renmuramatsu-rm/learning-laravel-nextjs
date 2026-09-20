<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;


class AuthController extends Controller
{
    public function register(RegisterRequest $registerRequest)
    {
        $user = User::create($registerRequest->validated());
        $token = $user->createToken('registerUser')->plainTextToken;
        return response()->json(['token' => $token]);
    }

    public function login(LoginRequest $loginRequest){
        $user = User::where('email', $loginRequest->email)->first();
        if(!$user || !Hash::check($loginRequest->password, $user->password)){
            return response()->json(['message' => 'ログインエラー'], 422);
        } else{
            $token = $user->createToken('loginUser')->plainTextToken;
            return response()->json(['token' => $token]);
        }
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'ログアウトしました']);
    }
}
