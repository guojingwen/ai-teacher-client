import {
  IconKeyboard,
  IconMicrophone,
  IconSend,
  IconPointer,
} from '@tabler/icons-react';
import { Input, Toast } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { getInputState, switchInput } from '../store/inputSlice';
import { useEffect, useState } from 'react';
import { getUserState } from '../store/userSlice';
import events from '../utils/event';

type Props = {
  submit: (prompt: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
};
export default function WelFooterInputcome({
  submit,
  prompt,
  setPrompt,
}: Props) {
  const inputState = useSelector(getInputState);
  const userState = useSelector(getUserState);
  const dispatch = useDispatch();
  const [isGranted, setIsGranted] = useState<boolean>(
    window.isVoiceGrantPrivilege
  );
  const toSwitch = async function () {
    if (!isWxSdkReady) return;
    // 切到声音，未开启音频
    if (!inputState.isVoice && !window.isVoiceGrantPrivilege) {
      await new Promise((resolve) => {
        window.wx.startRecord({
          success() {
            if (!window.isVoiceGrantPrivilege) {
              window.isVoiceGrantPrivilege = true;
              setIsGranted(true);
              // Toast.show('已开启音频权限');
              window.wx.stopRecord();
              resolve(null);
            }
          },
        });
      });
    }
    dispatch(switchInput());
  };
  const onFocus = function (evt: any) {
    console.log('onFocus', userState.isLogin);
    if (!userState.isLogin) {
      evt.preventDefault();
      evt.currentTarget.blur();
      events.emit('needLogin');
    }
  };
  const onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      submit(prompt);
    }
  };
  const onSubmit = () => {
    if (!isWxSdkReady) return;
    submit(prompt);
  };
  /* 语音功能相关 */
  const [isRecording, setIsRecording] = useState(false);
  const start = async () => {
    if (!userState.isLogin) {
      events.emit('needLogin');
      return;
    }
    setIsRecording(true);
    window.wx.startRecord();
  };
  let localId: string | null = null;
  useEffect(() => {
    window.wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: function (res: { localId: string }) {
        Toast.show('微信限制，录音时间超过一分钟自动停止');
        localId = res.localId;
        setIsRecording(false);
        toConvert(localId);
      },
    });
  }, []);
  const end = () => {
    window.wx.stopRecord({
      success: function (res: { localId: string }) {
        localId = res.localId;
        setIsRecording(false);
        toConvert(localId);
      },
      error(err: any) {
        setIsRecording(false);
        console.log('----', err);
      },
    });
  };
  async function toConvert(localId: string) {
    window.wx.translateVoice({
      localId, // 需要识别的音频的本地Id，由录音相关接口获得
      isShowProgressTips: 0, // 默认为1，显示进度提示
      success: function (res: { translateResult: string }) {
        const text = res.translateResult;
        setPrompt(text);
        submit(text);
      },
    });
  }

  const [isWxSdkReady, setWxSdkReady] = useState(false);
  useEffect(() => {
    window.wxPromise.then(setWxSdkReady);
  }, []);
  return (
    <div className='flex w-full pl-2 pr-4 py-4 items-center relative'>
      <div
        className='inline-flex items-center justify-center active:bg-gray-200 h-10 w-10 rounded-xl mr-1'
        onClick={toSwitch}>
        {inputState.isVoice ? (
          <IconKeyboard />
        ) : (
          <IconMicrophone
            style={{ color: isWxSdkReady ? '#000' : '#aaa' }}
          />
        )}
      </div>
      <span
        className='absolute text-base'
        style={{
          display: isRecording ? 'inline-block' : 'none',
          top: '-1rem',
          left: '50%',
          transform: 'translateX(calc(-50% + 0.8rem))',
          letterSpacing: '0.2rem',
          color: 'green',
        }}>
        松开发送
      </span>
      <div
        className='flex w-full items-center rounded-2xl border-solid border border-slate-300 overflow-hidden pr-2'
        style={{
          borderColor: isRecording ? 'green' : 'rgb(203, 213, 225)',
        }}>
        {inputState.isVoice ? (
          <div
            className='w-full flex flex-row items-center justify-center h-11 select-none'
            onTouchStart={start}
            onTouchEnd={end}>
            <div className='text-gray-600 flex items-center select-none'>
              <IconPointer className='mr-2' size='1rem'></IconPointer>
              {isGranted ? '按住说话~' : '点击开启音频'}
              <IconMicrophone
                color={
                  isRecording ? 'green' : '#666'
                }></IconMicrophone>
            </div>
          </div>
        ) : (
          <>
            <Input
              onFocus={onFocus}
              placeholder='请输入问题'
              className='ml-3 h-11 border-0'
              value={prompt}
              onKeyDown={(evt) => onKeyDown(evt)}
              onChange={setPrompt}></Input>
            <IconSend
              onClick={onSubmit}
              style={{ color: isWxSdkReady ? '#000' : '#aaa' }}
            />
          </>
        )}
      </div>
    </div>
  );
}
