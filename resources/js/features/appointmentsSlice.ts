import { createSlice } from '@reduxjs/toolkit';

export interface Appointment {
    id: number;
    date: string;
    time: string;
    slot: number;
}

interface AppointmentsState {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;
}

const initialState: AppointmentsState = {
    appointments: [],
    loading: false,
    error: null,
};

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        fetchAppointmentsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAppointmentsSuccess: (state, action) => {
            state.loading = false;
            state.appointments = action.payload;
        },
        fetchAppointmentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addAppointmentRequest: (state) => {
            state.loading = true;
        },
        addAppointmentSuccess: (state, action) => {
            state.loading = false;
            state.appointments.push(action.payload);
        },
        addAppointmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateAppointmentRequest: (state) => {
            state.loading = true;
        },
        updateAppointmentSuccess: (state, action) => {
            state.loading = false;
            const index = state.appointments.findIndex((a) => a.id === action.payload.id);
            if (index !== -1) state.appointments[index] = action.payload;
        },
        updateAppointmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteAppointmentRequest: (state) => {
            state.loading = true;
        },
        deleteAppointmentSuccess: (state, action) => {
            state.loading = false;
            state.appointments = state.appointments.filter((a) => a.id !== action.payload);
        },
        deleteAppointmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchAppointmentsRequest,
    fetchAppointmentsSuccess,
    fetchAppointmentsFailure,
    addAppointmentRequest,
    addAppointmentSuccess,
    addAppointmentFailure,
    updateAppointmentRequest,
    updateAppointmentSuccess,
    updateAppointmentFailure,
    deleteAppointmentRequest,
    deleteAppointmentSuccess,
    deleteAppointmentFailure,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
