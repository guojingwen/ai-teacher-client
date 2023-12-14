import {
  MyResponse,
  ResUserInfo,
  WxResError,
  WxSign,
} from './apiType';

export async function fetchWxAuth(code: string) {
  const res = await fetch(`/api/wx/auth?code=${code}`, {
    method: 'GET',
  }).then((res) => res.json());
  return res as MyResponse<ResUserInfo> | WxResError;
}
export async function fetchWxJsSdk() {
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const res = await fetch(`/api/wx/jsapi?url=${url}`).then((res) =>
    res.json()
  );
  return res as WxSign;
}
