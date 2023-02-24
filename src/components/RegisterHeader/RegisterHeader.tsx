import { Link } from 'react-router-dom'
import shoppingLogo from '../../assets/shopping.svg'
export default function RegisterHeader() {
  return (
    <header className='py-5'>
      <div className='container'>
        <nav className='flex items-end'>
          <Link to='/'>
            <img
              src={shoppingLogo}
              alt='shoppingLogo'
              className='mx-5 h-8 fill-orange lg:h-11'
            />
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>Đăng ký</div>
        </nav>
      </div>
    </header>
  )
}
