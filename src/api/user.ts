import { ResUserInfo, ResUserNotLogin, MyResponse } from './apiType';

export async function checkLogin() {
  const res = await fetch('/api/checkLogin', {
    method: 'GET',
  }).then((res) => res.json());
  return res as MyResponse<ResUserInfo> | ResUserNotLogin;
}
