import { useEffect, useState } from 'react';
import './app.css';
import { checkLogin } from './api/user';

// todo 这里做一些全局注入
function App(props: any) {
  const [user, setUser] = useState({ isLogin: false });
  useEffect(() => {
    checkLogin().then(setUser);
    console.log(user);
  }, []);
  return <div className='app'>{props.children}</div>;
}

export default App;
