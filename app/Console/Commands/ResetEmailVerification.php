<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ResetEmailVerification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    #php artisan reset:email-verification ruseltayong@gmail.com
    protected $signature = 'reset:email-verification {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset the email verification status for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->email_verified_at = null;
            $user->save();
            $this->info("Email verification reset for: $email");
        } else {
            $this->error("User not found.");
        }
    }
}
