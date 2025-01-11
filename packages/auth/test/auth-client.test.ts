import { describe, test, expect, beforeEach, vi } from 'vitest'
import { AuthClient } from '../src/auth-client'
import fetch from 'cross-fetch'

vi.mock('cross-fetch')

describe('AuthClient', () => {
  let client: AuthClient

  beforeEach(() => {
    client = new AuthClient('http://localhost:4000')
    vi.clearAllMocks()
  })

  test('login sets tokens', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    await client.login('test@example.com', 'password', 1)
    
    expect(client.isAuthenticated()).toBe(true)
    expect(client.getAccessToken()).toBe('test-access-token')
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/login',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
          tenant_id: 1,
        }),
      })
    )
  })

  test('handles login failure', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    await expect(
      client.login('test@example.com', 'wrong-password', 1)
    ).rejects.toThrow('HTTP error! status: 401')

    expect(client.isAuthenticated()).toBe(false)
    expect(client.getAccessToken()).toBeNull()
  })

  test('refreshes token on 401 response', async () => {
    // Mock initial tokens
    client['accessToken'] = 'expired-token'
    client['refreshToken'] = 'valid-refresh-token'

    // Mock first request failing with 401
    const failedResponse = {
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Token expired' }),
    }

    // Mock refresh token request
    const refreshResponse = {
      ok: true,
      json: () => Promise.resolve({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      }),
    }

    // Mock successful retry with new token
    const successResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 1, email: 'test@example.com' }),
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce(failedResponse as any)
      .mockResolvedValueOnce(refreshResponse as any)
      .mockResolvedValueOnce(successResponse as any)

    const result = await client.getCurrentUser()

    expect(result).toEqual({ id: 1, email: 'test@example.com' })
    expect(client.getAccessToken()).toBe('new-access-token')
    expect(fetch).toHaveBeenCalledTimes(3)
  })
})

