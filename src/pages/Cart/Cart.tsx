import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { Purchase } from 'src/types/purchase.type'

import produce from 'immer'
import { useContext, useEffect, useMemo, useState } from 'react'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { AppContext } from 'src/context/App.context'
import noproduct from 'src/assets/no-product.png'
import Loading from 'src/components/Loading'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const {
    data: purchasesInCartData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const location = useLocation()
  const choosenPurchaseIdFromLocation = (
    location.state as { purchaseId: string } | null
  )?.purchaseId
  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  )
  const checkedPurchases = useMemo(
    () => extendedPurchases.filter((purchase) => purchase.checked),
    [extendedPurchases]
  )
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return (
          result +
          (current.product.price_before_discount - current.product.price) *
            current.buy_count
        )
      }, 0),
    [checkedPurchases]
  )

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch() //update xong thì gọi lại api của giỏ hàng để cập nhật data và đồng thời data mới này ko có disable nên người dùng có thể nhập lại input bình thường
    }
  })

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id') // dùng keyBy của lodash để clone hết data của giỏ hàng của mình gắn cho id của chính nó, đại khái là lưu ra 1 bản sao chép để giữ lại giá trị checked và sử dụng nó
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation =
            choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked:
              isChoosenPurchaseFromLocation ||
              Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  // const handleCheck =
  //   (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const updatedPurchases = extendedPurchases.map((purchase, index) => {
  //       if (index === productIndex) {
  //         return {
  //           ...purchase,
  //           checked: event.target.checked
  //         }
  //       }
  //       return purchase
  //     })
  //     setExtendedPurchases(updatedPurchases)
  //   }

  const handleCheck =
    (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedPurchases(
        produce((draft) => {
          // dùng immer sẽ nhanh và tiện hơn trong việc xử lý state để tránh bị mutate
          draft[purchaseIndex].checked = event.target.checked
        })
      )
    }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }
  const handleQuantity = (
    purchaseIndex: number,
    value: number,
    enable: boolean
  ) => {
    // mỗi lần update số lượng thì gọi api cho nó luôn

    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true // trong lúc update bằng chuột thì không cho người dùng nhập vào input
        })
      )
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    // delete 1 sản phẩm khỏi đơn hàng
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    // delete nhiều sản phẩm khỏi đơn hàng
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate([...purchasesIds])
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate([...body])
    }
  }
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {extendedPurchases.length > 0 ? (
              <>
                <div className='overflow-auto'>
                  <div className='min-w-[1000px]'>
                    <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                      <div className='col-span-6'>
                        <div className='flex items-center'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-skyblue'
                              checked={isAllChecked}
                              onChange={handleCheckAll}
                            />
                          </div>
                          <div className='flex-grow text-black'>Sản phẩm</div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 text-center'>
                          <div className='col-span-2'>Đơn giá</div>
                          <div className='col-span-1'>Số lượng</div>
                          <div className='col-span-1'>Số tiền</div>
                          <div className='col-span-1'>Thao tác</div>
                        </div>
                      </div>
                    </div>
                    {extendedPurchases.length > 0 && (
                      <div className='my-3 rounded-sm bg-white p-5 shadow'>
                        {extendedPurchases.map((purchase, index) => (
                          <div
                            key={purchase._id}
                            className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                          >
                            <div className='col-span-6'>
                              <div className='flex'>
                                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                  <input
                                    type='checkbox'
                                    className='h-5 w-5 accent-skyblue'
                                    checked={purchase.checked}
                                    onChange={handleCheck(index)}
                                  />
                                </div>
                                <div className='flex-grow'>
                                  <div className='flex'>
                                    <Link
                                      className='h-20 w-20 flex-shrink-0'
                                      to={`${path.home}${generateNameId({
                                        name: purchase.product.name,
                                        id: purchase.product._id
                                      })}`}
                                    >
                                      <img
                                        alt={purchase.product.name}
                                        src={purchase.product.image}
                                      />
                                    </Link>
                                    <div className='flex-grow px-2 pt-1 pb-2'>
                                      <Link
                                        to={`${path.home}${generateNameId({
                                          name: purchase.product.name,
                                          id: purchase.product._id
                                        })}`}
                                        className='text-left line-clamp-2'
                                      >
                                        {purchase.product.name}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-span-6'>
                              <div className='grid grid-cols-5 items-center'>
                                <div className='col-span-2'>
                                  <div className='flex items-center justify-center'>
                                    <span className='text-gray-300 line-through'>
                                      ₫
                                      {formatCurrency(
                                        purchase.product.price_before_discount
                                      )}
                                    </span>
                                    <span className='ml-3'>
                                      ₫{formatCurrency(purchase.product.price)}
                                    </span>
                                  </div>
                                </div>
                                <div className='col-span-1'>
                                  <QuantityController
                                    max={purchase.product.quantity}
                                    value={purchase.buy_count}
                                    classNameWrapper='flex items-center'
                                    onIncrease={(value) =>
                                      handleQuantity(
                                        index,
                                        value,
                                        value <= purchase.product.quantity
                                      )
                                    }
                                    onDecrease={(value) =>
                                      handleQuantity(index, value, value >= 1)
                                    }
                                    onType={handleTypeQuantity(index)}
                                    onFocusOut={(value) =>
                                      handleQuantity(
                                        index,
                                        value,
                                        value >= 1 &&
                                          value <= purchase.product.quantity &&
                                          value !==
                                            (purchasesInCart as Purchase[])[
                                              index
                                            ].buy_count
                                      )
                                    }
                                    disabled={purchase.disabled}
                                  />
                                </div>
                                <div className='col-span-1'>
                                  <span className='text-skyblue'>
                                    ₫
                                    {formatCurrency(
                                      purchase.product.price *
                                        purchase.buy_count
                                    )}
                                  </span>
                                </div>
                                <div className='col-span-1'>
                                  <button
                                    onClick={handleDelete(index)}
                                    className='bg-none text-black transition-colors hover:text-skyblue'
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
                  <div className='flex items-center'>
                    <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 accent-skyblue'
                        checked={isAllChecked}
                        onChange={handleCheckAll}
                      />
                    </div>
                    <button
                      className='mx-3 border-none bg-none'
                      onClick={handleCheckAll}
                    >
                      Chọn tất cả ({extendedPurchases.length})
                    </button>
                    <button
                      className='mx-3 border-none bg-none'
                      onClick={handleDeleteManyPurchases}
                    >
                      Xóa
                    </button>
                  </div>

                  <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                    <div>
                      <div className='flex items-center sm:justify-end'>
                        <div>
                          Tổng thanh toán ({checkedPurchasesCount} sản phẩm):
                        </div>
                        <div className='ml-2 text-2xl text-skyblue'>
                          ₫{formatCurrency(totalCheckedPurchasePrice)}
                        </div>
                      </div>
                      <div className='flex items-center text-sm sm:justify-end'>
                        <div className='text-gray-500'>Tiết kiệm</div>
                        <div className='ml-6 text-skyblue'>
                          ₫{formatCurrency(totalCheckedPurchaseSavingPrice)}
                        </div>
                      </div>
                    </div>
                    <Button
                      className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                      onClick={handleBuyPurchases}
                      disabled={buyProductsMutation.isLoading}
                    >
                      Mua hàng
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className='text-center'>
                <img
                  src={noproduct}
                  alt='no purchase'
                  className='mx-auto h-24 w-24'
                />
                <div className='mt-5 font-bold text-gray-400'>
                  Giỏ hàng của bạn còn trống
                </div>
                <div className='mt-5 text-center'>
                  <Link
                    to={path.home}
                    className=' rounded-sm bg-skyblue px-10 py-2  uppercase text-white transition-all hover:bg-skyblue/80'
                  >
                    Mua ngay
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
