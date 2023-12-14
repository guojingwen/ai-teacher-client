import Welcome from '../../components/Welcome';
import FooterInput from '../../components/FooterInput';
import { getUserState } from '../../store/userSlice';
import { useSelector } from 'react-redux';
import NavHeader from '../../components/NavHeader';

export default function Home() {
  const user = useSelector(getUserState);
  return (
    <div className='h-full w-full flex flex-col justify-between'>
      {!user.isLogin ? (
        <Welcome />
      ) : (
        <div>
          <NavHeader></NavHeader>
        </div>
      )}
      <FooterInput></FooterInput>
    </div>
  );
}
