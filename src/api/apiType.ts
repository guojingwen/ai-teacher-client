export interface MyResponse<T = any> {
  code: number;
  success: boolean;
  msg: string;
  data: T;
}

export interface WxResError {
  errcode: number;
  errmsg: string;
}

export interface ResUserInfo {
  isLogin: true;
  headimgurl: string;
  nickname: string;
  openid: string;
  sex: 0 | 1;
  province: string;
  balance: number;
}

export interface ResUserNotLogin {
  isLogin: false;
}

export interface WxSign {
  jsapi_ticket: string;
  timestamp: string;
  nonceStr: string;
  url: string;
  appId: string;
  signature: string;
}
