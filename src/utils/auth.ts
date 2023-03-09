import { User } from 'src/types/user.type'
export const LocalStorageEventTarget = new EventTarget() // dùng evenTarget của javascript để lắng nghe sự kiện của nó

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  // localStorage.clear
  const clearLSEvent = new Event('clearLS') // khi hàm này được chạy thì đồng thời nó cũng thông báo tới 1 sự kiện có tên là 'clearLS' để chạy nó, ta để nó ở file src/App.tsx
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () =>
  localStorage.getItem('access_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
