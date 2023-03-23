import { screen, waitFor } from '@testing-library/react'
import path from 'src/constants/path'
import { logScreen, renderWithRouter } from 'src/utils/testutils'
import { describe, expect, it } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

describe('Login', () => {
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    const { user } = renderWithRouter({ route: path.login }) //render được tới trang login
    await waitFor(() => {
      //sau đó kiểm tra xem có đoạn PlaceholderText là Email hay ko, nếu có thì nghĩa là đã đúng và đúng thì chạy xuống dưới
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
    const submitButton = document.querySelector(
      'form button[type="submit"]'
    ) as Element
    user.click(submitButton) //sau đó nhấn submit và hiện tại trong input chứa nhập liệu gì
    expect(await screen.findByText('Email là bắt buộc')).toBeTruthy()
    expect(await screen.findByText('Password là bắt buộc')).toBeTruthy() // nếu nó show ra 2 đoan test này thì nghĩa là nó đã có hành động validate và show ra 2 dòng thông báo trên và nó show ra thì ta tìm thấy nó nghĩa là đúng vì cần nhập dữ liệu vào thì mới không báo lỗi khi nhấn submit
    // await logScreen()
  })
})
