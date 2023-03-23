import { describe, expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import matchers from '@testing-library/jest-dom/matchers'
import App from './App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { logScreen, renderWithRouter } from './utils/testutils'
import path from './constants/path'

expect.extend(matchers)

describe('App', () => {
  test('App render và chuyển trang', async () => {
    const { user } = renderWithRouter()
    /**
     * waitFor sẽ run callback 1 vài lần
     * cho đến khi hết timeout hoặc expect pass
     * số lần run phụ thuộc vào timeout và interval
     * mặc định: timeout = 1000ms và interval = 50ms
     */

    // khi chạy app lên
    // Verify vào đúng trang chủ
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe(
        'Sản Phẩm | web trade'
      )
    })

    // Khi có hành động click vào text có chữ Đăng nhập
    // Verify chuyển sang trang login
    await user.click(screen.getByText(/Đăng nhập/i))
    await waitFor(() => {
      // Khi có hành động click vào text có chữ Đăng nhập thì nó chạy vào page có các đoạn text như này thì nghĩa là thành công
      expect(screen.queryByText('Bạn chưa có tài khoản?')).toBeInTheDocument()
      expect(document.querySelector('title')?.textContent).toBe(
        'Đăng nhập | web trade'
      )
    })
  })
  test('Về trang not found', async () => {
    const badRoute = '/some/bad/route'
    renderWithRouter({ route: badRoute })
    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })

    // await logScreen() // dùng để nó in ra những gì mà nó đã render cho ta xem, có thể hiểu nó như consolog
  })

  test('Render trang register', async () => {
    renderWithRouter({ route: path.register })
    await waitFor(() => {
      expect(screen.getByText(/Bạn đã có tài khoản?/i)).toBeInTheDocument()
    })
  })
})
