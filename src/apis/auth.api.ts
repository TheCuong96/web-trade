import path from 'src/constants/path'
import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const registerAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(path.register, body)

export const login = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(path.login, body)

export const logout = () => http.post('/logout')
