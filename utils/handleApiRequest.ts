// utils/handleApiRequest.ts
import axios from 'axios';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

const handleApiRequest = async <T = any>(
  apiCall: () => Promise<any>
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      return {
        error: error.response?.data?.message || error.message || 'An error occurred',
        success: false,
      };
    } else {
      console.error('Unexpected error:', error);
      return {
        error: 'An unexpected error occurred',
        success: false,
      };
    }
  }
};

export default handleApiRequest;