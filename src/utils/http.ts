import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import {
  getAccessTokenToLS,
  removeAccessTokenToLS,
  saveAccessTokenToLS
} from './auth'
import { error } from 'console'

class Http {
  instance: AxiosInstance
  private accessToken: string // ta tạo 1 biến accessToken trong class trước
  constructor() {
    this.accessToken = getAccessTokenToLS() // lấy access_token từ localStorage để lưu vào biến ở đây, câu hỏi là tại sao làm vậy, làm vậy vì this.accessToken là lưu trên ram còn getAccessTokenToLS() là lưu trên ổ cứng của ta, nên mỗi khi ta reload lại page hay cần dùng tới accessToken thì ta chỉ cần lấy trong class từ ra ram ra thì nó sẽ nhanh hơn lấy từ ổ cứng rất nhiều
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use((response) => {
      console.log('response', response)
      // khi đăng nhập hoặc đăng ký thành công thì api trả về cho ta access_token và url, lấy url ra để kiểm tra xem là gì, nếu là login hoặc register thì set access_token vào localStorage và accessToken ở
      const { url } = response.config
      if (url === '/login' || url === '/register') {
        this.accessToken = response.data.data.access_token // vì ở trên ta tạo ra accessToken nên ta lưu vào đây trước
        saveAccessTokenToLS(this.accessToken)
      } else if (url === '/logout') {
        this.accessToken = ''
        removeAccessTokenToLS()
      }
      return response
    }),
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
  }
}

const http = new Http().instance

export default http
