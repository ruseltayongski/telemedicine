<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        // Update current user's online status
        $currentUser = Auth::user();
        $currentUser->online_status = true;
        $currentUser->last_active = now();
        $currentUser->save();
        
        $users = User::where('id', '!=', Auth::id())
                ->where(function($query){
                    $query->where('email','ruseltayong@gmail.com')
                        ->orWhere('email','rusel.ideahub@gmail.com');
                })
                ->get();
        
        return Inertia::render('Chat/Index', [
            'users' => $users,
            'currentUser' => $currentUser,
        ]);
    }
    
    public function updateOnlineStatus(Request $request)
    {
        $user = Auth::user();
        $user->online_status = $request->status;
        $user->last_active = now();
        $user->save();
        
        return response()->json(['status' => 'success']);
    }
}