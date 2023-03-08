import { Link } from 'react-router-dom'
import shoppingLogo from '../../assets/shopping.svg'
import Popover from '../Popover'
import { useQuery } from '@tanstack/react-query'
import { AppContext } from 'src/context/App.context'
import { useContext } from 'react'
import path from 'src/constants/path'
import { Schema, schema } from 'src/utils/rules'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { formatCurrency } from 'src/utils/utils'
import noproduct from 'src/assets/no-product.png'
import useSearchProducts from 'src/hooks/useSearchProducts'
import NavHeader from '../NavHeader'

type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])
const MAX_PURCHASES = 5
export default function Header() {
  const { isAuthenticated } = useContext(AppContext)
  const { onSubmitSearch, register } = useSearchProducts()
  // Khi chúng ta chuyển trang thì Header chỉ bị re-render
  // Chứ không bị unmount - mounting again
  // (Tất nhiên là trừ trường hợp logout rồi nhảy sang RegisterLayout rồi nhảy vào lại)
  // Nên các query này sẽ không bị inactive => Không bị gọi lại => không cần thiết phải set stale: Infinity
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated // khi đã logout ra thì sẽ không gọi api cảu cart nữa
  })
  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <div className='bg-[linear-gradient(-180deg,skyblue,skyblue)] pb-5 pt-2 text-white'>
      <div className='container'>
        <NavHeader />
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link to='/' className='col-span-2'>
            <img
              src={shoppingLogo}
              alt='shoppingLogo'
              className='h-11 w-full fill-white'
            />
          </Link>
          <form className='col-span-9' onSubmit={onSubmitSearch}>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                {...register('name')}
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder='Free Ship Đơn Từ 0Đ'
              />
              <button className='flex-shrink-0 rounded-sm bg-skyblue py-2 px-6 hover:opacity-90'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-end'>
            <Popover
              renderPopover={
                <div className='relative max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
                  {purchasesInCart ? (
                    <div className='p-2'>
                      <div className='capitalize text-gray-400'>
                        Sản phẩm mới thêm
                      </div>
                      <div className='mt-5'>
                        {purchasesInCart
                          .slice(0, MAX_PURCHASES)
                          .map((purchase) => (
                            <div
                              className='mt-2 flex py-2 hover:bg-gray-100'
                              key={purchase._id}
                            >
                              <div className='flex-shrink-0'>
                                <img
                                  src={purchase.product.image}
                                  alt={purchase.product.name}
                                  className='h-11 w-11 object-cover'
                                />
                              </div>
                              <div className='ml-2 flex-grow overflow-hidden'>
                                <div className='truncate'>
                                  {purchase.product.name}
                                </div>
                              </div>
                              <div className='ml-2 flex-shrink-0'>
                                <span className='text-skyblue'>
                                  ₫{formatCurrency(purchase.product.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>
                          {purchasesInCart.length > MAX_PURCHASES
                            ? purchasesInCart.length - MAX_PURCHASES
                            : ''}{' '}
                          Thêm hàng vào giỏ
                        </div>
                        <Link
                          to={path.cart}
                          className='rounded-sm bg-skyblue px-4 py-2 capitalize text-white hover:bg-opacity-90'
                        >
                          Xem giỏ hàng
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className='flex h-[300px] w-[300px] items-center justify-center p-2'>
                      <img
                        src={noproduct}
                        alt='no purchase'
                        className='h-24 w-24'
                      />
                      <div className='mt-3 capitalize'>Chưa có sản phẩm</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to={path.cart} className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-8 w-8'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                {purchasesInCart && (
                  <span className='absolute top-[-5px] left-[17px] rounded-full bg-white px-[9px] py-[1px] text-xs text-skyblue '>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
