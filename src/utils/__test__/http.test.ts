import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { describe, expect, it, beforeEach } from 'vitest'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '../auth'
import { Http } from '../http'

describe('http axios', () => {
  let http = new Http().instance
  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })
  const access_token_1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDAwM2ZkNmQ3YzYyMDM0MDg1MmMwMSIsImVtYWlsIjoiYzEwQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDMtMjFUMTg6Mzk6MDIuMzg4WiIsImlhdCI6MTY3OTQyMzk0MiwiZXhwIjoxNjc5NDIzOTQzfQ.sVC9l5l_NGvZrjaQgnzSZ2C4ga63zVRZBET9Mz-onp8'
  const refresh_token_1000days =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDAwM2ZkNmQ3YzYyMDM0MDg1MmMwMSIsImVtYWlsIjoiYzEwQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDMtMjFUMTg6Mzg6NTAuOTM4WiIsImlhdCI6MTY3OTQyMzkzMCwiZXhwIjoxNzY1ODIzOTMwfQ.6GFe3BawBi-KKT1GIY9GqM7lEwxZdL-xxm3ZyGe2suc'

  it('Gọi API', async () => {
    // Không nên đụng đến thư mục apis
    // Vì chúng ta test riêng file http thì chỉ "nên" dùng http thôi
    // vì lỡ như thư mục apis có thay đổi gì đó
    // thì cũng không ảnh hưởng gì đến file test này
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Auth Request', async () => {
    // Nên có 1 cái account test
    // và 1 server test
    await http.post('login', {
      email: 'c10@gmail.com',
      password: '123123'
    })
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh Token', async () => {
    setAccessTokenToLS(access_token_1s)
    setRefreshTokenToLS(refresh_token_1000days)
    const httpNew = new Http().instance
    const res = await httpNew.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
