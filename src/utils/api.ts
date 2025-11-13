const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bus-booking-ticket-nest-production.up.railway.app/api';

// Helper to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Helper to create headers with auth
function getHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

// Helper function to format duration from minutes to "6h 40p"
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}p`;
}

// Map API trip to frontend trip format
export function mapTripFromAPI(apiTrip: any) {
  return {
    id: apiTrip.id,
    company: apiTrip.company?.name || '',
    companyRating: parseFloat(apiTrip.company?.rating || 0),
    from: apiTrip.fromStation?.name || '',
    to: apiTrip.toStation?.name || '',
    departureTime: apiTrip.departureTime,
    arrivalTime: apiTrip.arrivalTime,
    duration: formatDuration(apiTrip.duration),
    price: parseFloat(apiTrip.price),
    busType: apiTrip.busType,
    availableSeats: apiTrip.availableSeats || 0,
    totalSeats: apiTrip.totalSeats || 0,
    amenities: apiTrip.amenities || [],
  };
}

// Search trips
export async function searchTrips(params: {
  from: string;
  to: string;
  date: string;
  passengers?: number;
  minPrice?: number;
  maxPrice?: number;
  busType?: string;
  timeSlot?: string;
  sortBy?: 'price' | 'time' | 'rating';
}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE_URL}/trips/search?${queryParams}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to search trips' }));
    throw new Error(error.message || 'Failed to search trips');
  }
  const data = await response.json();
  return data.map(mapTripFromAPI);
}

// Get trip details
export async function getTrip(id: string) {
  const response = await fetch(`${API_BASE_URL}/trips/${id}`);
  if (!response.ok) {
    throw new Error('Failed to get trip');
  }
  const data = await response.json();
  return mapTripFromAPI(data);
}

// Get trip seats
export async function getTripSeats(tripId: string) {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/seats`);
  if (!response.ok) {
    throw new Error('Failed to get seats');
  }
  return response.json();
}

// Hold seats
export async function holdSeats(tripId: string, seatIds: string[]) {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/seats/hold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seatIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to hold seats');
  }
  return response.json();
}

// Release seats
export async function releaseSeats(seatIds: string[]) {
  const response = await fetch(`${API_BASE_URL}/trips/${seatIds[0]}/seats/release`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seatIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to release seats');
  }
  return response.json();
}

// Create booking
export async function createBooking(bookingData: {
  tripId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupPoint?: string;
  dropoffPoint?: string;
  seats: { seatId: string }[];
}) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create booking' }));
    throw new Error(error.message || 'Failed to create booking');
  }
  return response.json();
}

// Get all bookings (requires auth)
export async function getBookings() {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error('Failed to get bookings');
  }
  const data = await response.json();
  return data.map((booking: any) => {
    // Map bookingSeats to seats format
    const seats = booking.bookingSeats?.map((bs: any) => ({
      id: bs.seat?.id || bs.seatId,
      number: bs.seat?.number || bs.seatNumber || '',
      row: bs.seat?.row || 0,
      floor: bs.seat?.floor || 1,
      status: bs.seat?.status || 'booked',
    })) || [];
    
    return {
      id: booking.id,
      orderId: booking.id, // Use booking id as orderId
      trip: booking.trip ? mapTripFromAPI(booking.trip) : null,
      seats: seats,
      customerInfo: {
        name: booking.customerName || '',
        phone: booking.customerPhone || '',
        email: booking.customerEmail || '',
        pickupPoint: booking.pickupPoint || '',
        dropoffPoint: booking.dropoffPoint || '',
      },
      totalPrice: parseFloat(booking.totalPrice || 0),
      paymentMethod: booking.paymentMethod || 'cash',
      status: (booking.status || 'pending').toLowerCase(),
      bookingDate: booking.createdAt || booking.bookingDate || new Date().toISOString(),
    };
  });
}

// Search booking
export async function searchBooking(query: string) {
  const response = await fetch(`${API_BASE_URL}/bookings/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search booking');
  }
  const data = await response.json();
  if (!data) return null;
  
  // Map bookingSeats to seats format (same as getBookings)
  const seats = data.bookingSeats?.map((bs: any) => ({
    id: bs.seat?.id || bs.seatId,
    number: bs.seat?.number || bs.seatNumber || '',
    row: bs.seat?.row || 0,
    floor: bs.seat?.floor || 1,
    status: bs.seat?.status || 'booked',
  })) || [];
  
  return {
    id: data.id,
    orderId: data.id,
    trip: data.trip ? mapTripFromAPI(data.trip) : null,
    seats: seats,
    customerInfo: {
      name: data.customerName || '',
      phone: data.customerPhone || '',
      email: data.customerEmail || '',
      pickupPoint: data.pickupPoint || '',
      dropoffPoint: data.dropoffPoint || '',
    },
    totalPrice: parseFloat(data.totalPrice || 0),
    paymentMethod: data.paymentMethod || 'cash',
    status: data.status || 'pending',
    bookingDate: data.createdAt || data.bookingDate || new Date().toISOString(),
  };
}

// Cancel booking (requires auth)
export async function cancelBooking(bookingId: string) {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error('Failed to cancel booking');
  }
  return response.json();
}

// Get stations
export async function getStations() {
  const response = await fetch(`${API_BASE_URL}/stations`);
  if (!response.ok) {
    throw new Error('Failed to get stations');
  }
  return response.json();
}

// Get popular routes
export async function getPopularRoutes() {
  const response = await fetch(`${API_BASE_URL}/stations/popular-routes`);
  if (!response.ok) {
    throw new Error('Failed to get popular routes');
  }
  return response.json();
}

// Admin APIs
export async function updateBookingStatus(bookingId: string, status: string) {
  console.log('updateBookingStatus called:', { bookingId, status });
  
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ status }),
  });
  
  console.log('updateBookingStatus response:', { 
    ok: response.ok, 
    status: response.status, 
    statusText: response.statusText 
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update booking status' }));
    console.error('updateBookingStatus error:', error);
    throw new Error(error.message || 'Failed to update booking status');
  }
  
  const data = await response.json();
  console.log('updateBookingStatus success:', data);
  return data;
}

export async function createAdmin(adminData: { email: string; password: string; name?: string; phone?: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(adminData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create admin' }));
    throw new Error(error.message || 'Failed to create admin');
  }
  return response.json();
}

export async function createTrip(tripData: any) {
  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(tripData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create trip' }));
    throw new Error(error.message || 'Failed to create trip');
  }
  return response.json();
}

export async function createTripsBatch(tripsData: any) {
  const response = await fetch(`${API_BASE_URL}/trips/batch`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(tripsData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create trips' }));
    throw new Error(error.message || 'Failed to create trips');
  }
  return response.json();
}

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/statistics/dashboard`, {
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error('Failed to get dashboard stats');
  }
  return response.json();
}

