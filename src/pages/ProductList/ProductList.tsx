import { useQuery } from '@tanstack/react-query'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQueryParams from 'src/hooks/useQueryParams'
import { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'
import Product from './components/Product'
import SortProductList from './components/SortProductList'
import AsideFilter from './components/AsideFilter'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true //lưu trữ data trước đó để show ra trước rồi mới từ từ call api sau để cập nhật, tránh khi bị gọi api thì nó bị load cho nên tăng UX hơn
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  return (
    <div className='bg-gray-200 py-6'>
       <Helmet>
        <title>Sản Phẩm | web trade</title>
        <meta name='description' content='VẬT PHẨM, SẢN PHẨM, web bán hàng, trade, mua đồ, bán đồ, đồ dùng, mua sắm, hao tiền, tốn tiền >><< [ghi những thứ người ta có thể search gg tìm kiếm về trang web của chúng ta, ở đây là 1 trang web bán hàng]' />
      </Helmet>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter
                queryConfig={queryConfig}
                categories={categoriesData?.data.data || []}
              />
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
