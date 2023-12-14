import { useEffect } from 'react';
import './app.css';
import { checkLogin } from './api/user';
import { fetchWxAuth, fetchWxJsSdk } from './api/wx';
import { MyResponse, ResUserInfo, WxSign } from './api/apiType';
import { Dialog, Toast } from 'antd-mobile';

import { login, logout } from './store/userSlice';
import { useDispatch } from 'react-redux';
import events from './utils/event';
import { getUrlParams } from './utils/utils';

// todo 这里做一些全局注入
let config: WxSign | null = null;
function App(props: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    const params = getUrlParams(window.location.search);
    const { code } = params;
    if (code) {
      window.history.replaceState(null, '', '/');
      fetchWxAuth(code).then((res) => {
        const { data } = res as MyResponse<ResUserInfo>;
        if (data?.isLogin) {
          dispatch(login(data));
          Toast.show('登录成功');
        } else {
          dispatch(logout());
        }
      });
    } else {
      checkLogin().then((res) => {
        const { data } = res as MyResponse<ResUserInfo>;
        if (data.isLogin) {
          dispatch(login(data));
        }
      });
    }
    window.wxPromise = fetchWxJsSdk().then((res) => {
      config = res;
      const _config = {
        debug: false,
        appId: res.appId,
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: [
          'checkJsApi',
          'startRecord',
          'stopRecord',
          'onRecordEnd',
          'playVoice',
          'stopVoice',
          'downloadVoice',
          'scanQRCode',
          'chooseImage',
        ], // 必填，需要使用的JS接口列表
      };
      window.wx.config(_config);
      return new Promise((resolve) => {
        window.wx.ready(function () {
          //需在用户可能点击分享按钮前就先调用
          resolve(null);
        });
      });
    });
    events.on('needLogin', toCheckLogin);
    return () => {
      events.off('needLogin');
    };
  }, []);
  function toCheckLogin() {
    // e.stopPropagation();
    Dialog.confirm({
      title: '温馨提示',
      content:
        '与AI对话需要消耗积分，新用户登录可以获得3元积分，如果你是他人邀请的新用户，他可以获得2元积分',
      onConfirm: async () => {
        const { location } = window;
        const url = `${location.protocol}//${location.host}`;
        const redirect_uri = encodeURIComponent(url);
        const authUrl =
          'https://open.weixin.qq.com/connect/oauth2/authorize';
        const scope = 'snsapi_userinfo'; // snsapi_base 和 snsapi_userinfo
        const state = '123abc';
        const targetUrl = `${authUrl}?appid=${
          config!.appId
        }&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
        window.location.href = targetUrl;
      },
    });
  }
  return <div className='app'>{props.children}</div>;
}

export default App;
