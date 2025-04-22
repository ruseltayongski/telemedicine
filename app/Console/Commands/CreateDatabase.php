<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class CreateDatabase extends Command
{
    protected $signature = 'db:create';
    protected $description = 'Create the database specified in the .env file';

    public function handle()
    {
        $database = config('database.connections.mysql.database');

        // Temporarily switch to "no database" to allow DB creation
        config(['database.connections.mysql.database' => null]);

        try {
            DB::statement("CREATE DATABASE IF NOT EXISTS `$database`");
            $this->info("Database '$database' created or already exists.");
        } catch (\Exception $e) {
            $this->error("Failed to create database: " . $e->getMessage());
        }

        // Restore database config
        config(['database.connections.mysql.database' => $database]);
    }
}
