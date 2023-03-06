import axios, { AxiosError } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(
  error: unknown
): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  )
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

export const rateSale = (original: number, sale: number) =>
  Math.round(((original - sale) / original) * 100) + '%'

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape, prettier/prettier
  /** thay đổi những ký hiệu đặc biệt thành khoảng trống */
  str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ''
  )

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  console.log('xxx', removeSpecialCharacter(name))
  /** thay đổi những khoảng trống thành dấu '-' và ở đoạn cuối cùng gắn thêm -id- và biến {id} */
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-id-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  /** lấy id trên 1 đoạn string sau khi nhìn thấy -id- trên đoạn string đó */
  const arr = nameId.split('-id-')
  return arr[arr.length - 1]
}
