<?php

namespace App\Http\Controllers;

use App\Models\LabRequest;
use App\Models\LabTest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class LabRequestController extends Controller
{  
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = LabRequest::query()
            ->with(['labTest', 'doctor:id,name', 'patient:id,name']);
        
        // Filter based on user role
        if ($user->role === 'doctor') {
            $query->where('doctor_id', $user->id);
        } elseif ($user->role === 'patient') {
            $query->where('patient_id', $user->id);
        }
        
        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $labRequests = $query->latest()->paginate(10);
        
        return Inertia::render('LabRequests/Index', [
            'labRequests' => $labRequests,
            'filters' => $request->all(['status']),
        ]);
    }
    
    public function create()
    {   
        $labTests = LabTest::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'price', 'code', 'requires_fasting']);
            
        $patients = User::where('role_id', 3)
            ->orderBy('name')
            ->get(['id', 'name']);
            
        return Inertia::render('LabRequests/Create', [
            'labTests' => $labTests,
            'patients' => $patients,
        ]);
    }
    
    public function labTests()
    {
        $labTests = LabTest::where('is_active', true)
            ->orderBy('name')
            ->get();
        
        return response()->json($labTests);
    }

    public function labRequestCreate(Request $request)
    {
        // Find existing lab request with the same doctor, patient, and booking
        $labRequest = LabRequest::where('doctor_id', $request->doctor_id)
            ->where('patient_id', $request->patient_id)
            ->where('booking_id', $request->booking_id)
            ->first();

        if ($labRequest) {
            // Update the existing lab request
            $labRequest->update([
                'scheduled_date' => $request->scheduled_date,
                'requested_date' => $request->requested_date,
                'doctor_notes' => $request->doctor_notes,
            ]);

            // Sync (update) the lab tests instead of attach (adds duplicates)
            $labRequest->labTests()->sync($request->lab_tests);
        } else {
            // Create a new lab request
            $labRequest = LabRequest::create([
                'doctor_id' => $request->doctor_id,
                'patient_id' => $request->patient_id,
                'booking_id' => $request->booking_id,
                'scheduled_date' => $request->scheduled_date,
                'requested_date' => $request->requested_date,
                'doctor_notes' => $request->doctor_notes,
            ]);

            // Attach the lab tests
            $labRequest->labTests()->attach($request->lab_tests);
        }

        return response()->json([
            'message' => $labRequest->wasRecentlyCreated
                ? 'Lab request submitted successfully'
                : 'Lab request updated successfully',
            'lab_request' => $labRequest->load('labTests'),
        ], 201);
    }

    public function downloadLabRequestPdf(Request $request)
    {
        // $pdf = PDF::loadView('pdf.lab_request');
        // return $pdf->stream('sample-lab-request.pdf');
        $lab_request = LabRequest::with(['booking', 'labTests', 'patient', 'doctor.facility'])
            ->where('patient_id', $request->patient_id)
            ->where('doctor_id', $request->doctor_id)
            ->where('booking_id', $request->booking_id)
            ->first();
        //return $lab_request->labTests;
        $pdf = Pdf::loadView('pdf.lab_request', [
            'lab_request' => $lab_request,
        ]);
        $pdf->setPaper('a4');
        return $pdf->stream('Lab Request - ' . $lab_request->patient->name . '.pdf');
    }
}