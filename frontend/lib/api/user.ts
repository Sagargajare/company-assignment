import { API_ENDPOINTS } from './config';

export interface CreateUserRequest {
  email: string;
  name: string;
  timezone?: string;
  language_preference?: 'en' | 'hi';
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  timezone: string;
  language_preference: string;
  created_at: Date;
}

export interface CreateUserResponse {
  success: boolean;
  data: UserResponse;
  message?: string;
}

export async function createUser(request: CreateUserRequest): Promise<UserResponse> {
  const response = await fetch(API_ENDPOINTS.CREATE_USER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create user: ${response.statusText}`);
  }

  const data: CreateUserResponse = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to create user');
  }

  return data.data;
}

