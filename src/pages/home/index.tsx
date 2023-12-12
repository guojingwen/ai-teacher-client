import Welcome from '../../components/Welcome';
import FooterInput from '../../components/FooterInput';
export default function Home() {
  return (
    <div className='h-full w-full flex flex-col justify-between'>
      <Welcome></Welcome>
      <FooterInput></FooterInput>
    </div>
  );
}
