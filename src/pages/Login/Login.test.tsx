import { fireEvent, screen, waitFor } from '@testing-library/react'
import path from 'src/constants/path'
import { logScreen, renderWithRouter } from 'src/utils/testutils'
import { describe, expect, it, beforeAll } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

describe('Login', () => {
  beforeAll(async () => {
    renderWithRouter({ route: path.login }) //render được tới trang login
    await waitFor(() => {
      //sau đó kiểm tra xem có đoạn PlaceholderText là Email hay ko, nếu có thì nghĩa là đã đúng và đúng thì chạy xuống dưới
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
  })
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    const submitButton = document.querySelector(
      'form button[type="submit"]'
    ) as Element
    fireEvent.submit(submitButton)
    await waitFor(async () => {
      expect(await screen.findByText('Email là bắt buộc')).toBeTruthy()
      expect(await screen.findByText('Password là bắt buộc')).toBeTruthy() // nếu nó show ra 2 đoan test này thì nghĩa là nó đã có hành động validate và show ra 2 dòng thông báo trên và nó show ra thì ta tìm thấy nó nghĩa là đúng vì cần nhập dữ liệu vào thì mới không báo lỗi khi nhấn submit
    })
  })
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    const emailInput = document.querySelector(
      'form input[type="email"]'
    ) as HTMLInputElement
    const passwordInput = document.querySelector(
      'form input[type="password"]'
    ) as HTMLInputElement
    const submitButton = document.querySelector(
      'form button[type="submit"]'
    ) as HTMLButtonElement
    fireEvent.change(emailInput, {
      target: {
        value: 'test@mail'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)
    expect(await screen.findByText('Email không đúng định dạng')).toBeTruthy()
    expect(await screen.findByText('Độ dài từ 6 - 160 ký tự')).toBeTruthy()

    // await logScreen()
  })
})
