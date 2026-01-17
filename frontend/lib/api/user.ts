import { API_ENDPOINTS } from './config';
import type { CreateUserRequest, UserResponse, CreateUserResponse } from '@/types';

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

