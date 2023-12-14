import {} from 'antd-mobile';
import { IconUser, IconMenu2 } from '@tabler/icons-react';
export default function NavHeader() {
  return (
    <header className='flex items-center justify-between py-3 px-3'>
      <div className='flex items-center'>
        <span className='active:bg-gray-200 inline-block py-0.5 px-0.5 rounded-sm'>
          <IconMenu2></IconMenu2>
        </span>
        <span>下拉选择</span>
        <span>管理</span>
      </div>
      <div>
        <span className='active:bg-gray-200 inline-block py-0.5 px-0.5 rounded-sm'>
          <IconUser></IconUser>
        </span>
      </div>
    </header>
  );
}
