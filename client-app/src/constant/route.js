import { IconType } from 'react-icons';
import { AiOutlineBarChart, AiOutlineMedicineBox } from 'react-icons/ai';
import { BiBox } from 'react-icons/bi';
import { BsShop } from 'react-icons/bs';
import { CgProfile, CgUserList } from 'react-icons/cg';
import { FiHome, FiUsers } from 'react-icons/fi';
import { GiShoppingCart } from 'react-icons/gi';
import { RiDashboardLine } from 'react-icons/ri';

const ROUTING_PAGES = {
  admin: [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: FiHome,
      type: 'parent',
    },
    {
      label: 'Customer',
      href: '/admin/customer',
      icon: RiDashboardLine,
      type: 'parent',
    },
    {
      label: 'Product',
      href: '/admin/produk',
      icon: BiBox,
      type: 'parent',
    },
    {
      label: 'Tambah Produk',
      href: '/admin/produk/create',
      icon: AiOutlineMedicineBox,
      type: 'child',
    },
    {
      label: 'Category',
      href: '/admin/create-category',
      icon: GiShoppingCart,
      type: 'parent',
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: RiDashboardLine,
      type: 'parent',
    },
    {
      label: 'Shipping',
      href: '/admin/shipping',
      icon: GiShoppingCart,
      type: 'parent',
    },
    {
      label: 'Report',
      href: '/admin/statistik',
      icon: AiOutlineBarChart,
      type: 'parent',
    },
    // {
    //   label: 'Profile',
    //   href: '/admin/profile',
    //   icon: CgProfile,
    //   type: 'parent',
    // },
  ],
  user: [
    {
      label: 'Dashboard User',
      href: '/user/dashboard',
      icon: FiHome,
      type: 'parent',
    },
    {
      label: 'Customer',
      href: '/user/customer',
      icon: RiDashboardLine,
      type: 'parent',
    },
    {
      label: 'Payment',
      href: '/user/paymant',
      icon: AiOutlineMedicineBox,
      type: 'parent',
    },
    {
      label: 'Bukti Payment',
      href: '/user/bukti-paymant',
      icon: AiOutlineMedicineBox,
      type: 'child',
    },
    {
      label: 'Orders',
      href: '/user/orders',
      icon: RiDashboardLine,
      type: 'parent',
    },
  ]

};

export { ROUTING_PAGES }