<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Chat;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_code' => 'required|exists:booked_appointments,booking_code',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'message' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx|max:10240', // 10MB max
        ]);
        
        $fileData = null;
        
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = Str::random(20) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('chat_files', $fileName, 'public');
            
            $fileData = [
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ];
            unset($validated['file']);
        }
        
        $message = Chat::create(array_merge(
            $validated,
            $fileData ?? []
        ));
        
        return response()->json($message, 201);
    }

    public function downloadFile($id)
    {
        $message = Chat::findOrFail($id);
        
        if (!$message->file_path) {
            abort(404);
        }
        
        return Storage::disk('public')->download($message->file_path, $message->file_name);
    }
    
    public function chats(Request $request)
    {
        $messages = Chat::where('booking_id', $request->booking_id)
            ->where(function($query) use ($request) {
                $query->where('sender_id', $request->user_id)
                    ->orWhere('receiver_id', $request->user_id);
            })
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }
}