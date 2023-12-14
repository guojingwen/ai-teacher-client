import {
  IconKeyboard,
  IconMicrophone,
  IconSend,
  IconPointer,
} from '@tabler/icons-react';
import { Input } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { getInputState, switchInput } from '../store/inputSlice';
import { useState } from 'react';
import { getUserState } from '../store/userSlice';
import events from '../utils/event';
import { fetchChat } from '../api/chat';

export default function WelFooterInputcome() {
  const inputState = useSelector(getInputState);
  const userState = useSelector(getUserState);
  const dispatch = useDispatch();
  const [isGranted, setIsGranted] = useState<boolean>(
    window.isVoiceGrantPrivilege
  );
  const toSwitch = async function () {
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
      // evt.preventDefault();
      // events.emit('needLogin');
    }
  };
  const [prompt, setPrompt] = useState('');
  const onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      onSubmit();
    }
  };
  const onSubmit = () => {
    console.log('发送消息');
    fetchChat(prompt).then(console.log);
  };
  const [isRecording, setIsRecording] = useState(false);
  const start = async () => {
    setIsRecording(true);
    window.wx.startRecord();
  };
  const end = () => {
    window.wx.stopRecord({
      success: function (res: { localId: string }) {
        const { localId } = res;
        console.log('录音结束', localId);
        setIsRecording(false);
      },
      error(err: any) {
        setIsRecording(false);
        console.log('----', err);
      },
    });
    /* wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: function (res) {
        var localId = res.localId;
      },
    }); */
  };

  return (
    <div className='flex w-full pl-2 pr-4 py-4 items-center'>
      <div
        className='inline-flex items-center justify-center active:bg-gray-200 h-10 w-10 rounded-xl mr-1'
        onClick={toSwitch}>
        {inputState.isVoice ? <IconKeyboard /> : <IconMicrophone />}
      </div>
      <span className=''>松开发送</span>
      <div className='flex w-full items-center rounded-2xl border-solid border border-slate-300 overflow-hidden pr-2'>
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
                  isRecording ? 'red' : 'green'
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
            <IconSend />
          </>
        )}
      </div>
    </div>
  );
}
