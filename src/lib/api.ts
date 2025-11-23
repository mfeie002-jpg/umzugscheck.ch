/**
 * Centralized API helper module for all backend requests
 * Handles loading states, errors, and retry logic
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Ein Fehler ist aufgetreten',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        error: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.',
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Calculator API
export interface QuickCalculatorRequest {
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  rooms: string;
  movingType: string;
  floorsFrom: string;
  floorsTo: string;
  hasElevatorFrom: boolean;
  hasElevatorTo: boolean;
}

export interface AdvancedCalculatorRequest extends QuickCalculatorRequest {
  inventory: {
    boxes: number;
    wardrobes: number;
    beds: number;
    sofas: number;
    tables: number;
    chairs: number;
  };
  extraServices: {
    cleaning: boolean;
    disposal: boolean;
    packing: boolean;
    storage: boolean;
    assembly: boolean;
    specialItems: boolean;
  };
  movingDate: string;
}

export interface CalculatorResponse {
  priceMin: number;
  priceMax: number;
  volumeM3: number;
  estimatedHours: number;
  distance: number;
  breakdown?: {
    basePrice: number;
    distanceFee: number;
    floorFee: number;
    elevatorDiscount: number;
    total: number;
  };
}

export interface AICalculatorRequest {
  files: File[];
  fromPostal: string;
  toPostal: string;
}

export interface AICalculatorResponse extends CalculatorResponse {
  suggestedVolume: number;
  suggestedBoxes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  items: string[];
}

export interface LeadRequest {
  name: string;
  email: string;
  phone: string;
  moveDate: string;
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  calculatorType: string;
  calculatorInput: any;
  calculatorOutput: any;
  comments?: string;
  companyId?: string;
}

// API client instance
const api = new ApiClient();

// Calculator endpoints (mock implementations for now)
export const calculatorApi = {
  quick: async (data: QuickCalculatorRequest): Promise<ApiResponse<CalculatorResponse>> => {
    // For now, import the local calculation
    const { calculateQuickMovingPrice, estimateDistance } = await import('./pricing');
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const distance = estimateDistance(data.fromPostal, data.toPostal);
    const calculation = calculateQuickMovingPrice(
      data.rooms,
      distance,
      parseInt(data.floorsFrom),
      parseInt(data.floorsTo),
      data.hasElevatorFrom,
      data.hasElevatorTo
    );

    return {
      data: {
        ...calculation,
        distance,
      },
      status: 200,
    };
  },

  advanced: async (data: AdvancedCalculatorRequest): Promise<ApiResponse<CalculatorResponse>> => {
    const { calculateAdvancedMovingPrice, estimateDistance } = await import('./pricing');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const distance = estimateDistance(data.fromPostal, data.toPostal);
    const calculation = calculateAdvancedMovingPrice(
      data.inventory,
      distance,
      data.extraServices,
      parseInt(data.floorsFrom),
      parseInt(data.floorsTo),
      data.hasElevatorFrom,
      data.hasElevatorTo
    );

    return {
      data: {
        ...calculation,
        distance,
      },
      status: 200,
    };
  },

  ai: async (data: AICalculatorRequest): Promise<ApiResponse<AICalculatorResponse>> => {
    // Mock AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockVolume = 35;
    const mockBoxes = 45;
    const distance = 50; // Mock distance
    
    return {
      data: {
        priceMin: 1800,
        priceMax: 2400,
        volumeM3: mockVolume,
        estimatedHours: 8,
        distance,
        suggestedVolume: mockVolume,
        suggestedBoxes: mockBoxes,
        difficulty: 'medium',
        items: ['Möbel', 'Kartons', 'Elektrogeräte', 'Dekoration'],
        breakdown: {
          basePrice: 1200,
          distanceFee: 300,
          floorFee: 200,
          elevatorDiscount: 100,
          total: 2100,
        },
      },
      status: 200,
    };
  },
};

// Lead endpoints
export const leadApi = {
  submit: async (data: LeadRequest): Promise<ApiResponse<{ id: string }>> => {
    // This will use Supabase directly in components
    return api.post('/api/leads', data);
  },
};

// Company endpoints
export const companyApi = {
  list: async (filters?: { canton?: string; rating?: number }) => {
    // This will be handled by Supabase in components
    return api.get('/api/companies');
  },
  
  get: async (id: string) => {
    return api.get(`/api/companies/${id}`);
  },
};

export default api;
