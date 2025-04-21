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

class LabRequestController extends Controller
{   
    /**
     * Display a listing of the lab requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
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
    
    /**
     * Show the form for creating a new lab request.
     *
     * @return \Inertia\Response
     */
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
    
    /**
     * Store a newly created lab request in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    // public function store(Request $request)
    // {
    //     // Only doctors can create lab requests
    //     $this->authorize('create', LabRequest::class);
        
    //     $validated = $request->validate([
    //         'lab_test_id' => 'required|exists:lab_tests,id',
    //         'patient_id' => 'required|exists:users,id',
    //         'booking_id' => 'nullable|exists:bookings,id',
    //         'requested_date' => 'required|date|after_or_equal:today',
    //         'doctor_notes' => 'nullable|string',
    //         'priority' => 'required|in:normal,urgent',
    //     ]);
        
    //     $validated['doctor_id'] = Auth::id();
    //     $validated['status'] = 'pending';
        
    //     $labRequest = LabRequest::create($validated);
        
    //     // Generate PDF
    //     $pdfPath = $this->pdfGenerator->generate($labRequest);
        
    //     return redirect()->route('lab-requests.show', $labRequest)
    //         ->with('success', 'Lab request created successfully and PDF generated.');
    // }
    
    /**
     * Display the specified lab request.
     *
     * @param  \App\Models\LabRequest  $labRequest
     * @return \Inertia\Response
     */
    public function show(LabRequest $labRequest)
    {
        $this->authorize('view', $labRequest);
        
        $labRequest->load(['labTest', 'doctor:id,name', 'patient:id,name', 'booking']);
        
        return Inertia::render('LabRequests/Show', [
            'labRequest' => $labRequest
        ]);
    }
    
    /**
     * Download the lab request PDF.
     *
     * @param  \App\Models\LabRequest  $labRequest
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    // public function downloadPdf(LabRequest $labRequest)
    // {
    //     $this->authorize('view', $labRequest);
        
    //     // If PDF doesn't exist, generate it first
    //     if (!$labRequest->pdf_path || !Storage::exists($labRequest->pdf_path)) {
    //         $pdfPath = $this->pdfGenerator->generate($labRequest);
    //     } else {
    //         $pdfPath = $labRequest->pdf_path;
    //     }
        
    //     return Storage::download($pdfPath, 'lab-request-' . $labRequest->id . '.pdf');
    // }
    
    /**
     * Update the specified lab request status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LabRequest  $labRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    // public function updateStatus(Request $request, LabRequest $labRequest)
    // {
    //     $this->authorize('update', $labRequest);
        
    //     $validated = $request->validate([
    //         'status' => 'required|in:pending,scheduled,completed,cancelled',
    //         'completed_date' => $request->status === 'completed' ? 'required|date' : 'nullable|date',
    //         'result' => $request->status === 'completed' ? 'required|string' : 'nullable|string',
    //         'scheduled_date' => $request->status === 'scheduled' ? 'required|date' : 'nullable|date',
    //         'scheduled_time' => $request->status === 'scheduled' ? 'required' : 'nullable',
    //     ]);
        
    //     $labRequest->update($validated);
        
    //     // Re-generate PDF if status updated
    //     $pdfPath = $this->pdfGenerator->generate($labRequest);
        
    //     return back()->with('success', 'Lab request status updated successfully.');
    // }

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
}