import Welcome from '../../components/Welcome';
import FooterInput from '../../components/FooterInput';
import { getUserState } from '../../store/userSlice';
import { useSelector } from 'react-redux';
import NavHeader from '../../components/NavHeader';
import chatService from '@/utils/chatService';
import { useState } from 'react';
import {
  Assistant,
  Message,
  MessageList,
  SendMessage,
  Session,
} from '@/types';
import { useGetState } from '@/utils/hooks';
import { getInputState } from '@/store/inputSlice';
import {
  ResSpeechText,
  ResWxUpload,
  fetchSpeechText,
  fetchSpeechText2,
} from '@/api/chat';
import { audioInst } from '@/utils/utils';
import device from '@/utils/device';
import { IconUser } from '@tabler/icons-react';
import clsx from 'clsx';
import MessageContent from '@/components/MessageContent';
import { ResUserInfo } from '@/api/apiType';

export default function Home() {
  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: (sug: string) => {
      console.log('---onCompleted', sug);
      if (inputState.isVoice) {
        if (device.isAndroid) {
          fetchSpeechText(sug).then(
            ({ audioBase64 }: ResSpeechText) => {
              audioInst.play(audioBase64);
            }
          );
        } else {
          fetchSpeechText2(sug).then((res) => {
            const { media_id } = res as ResWxUpload;
            if (media_id) {
              playVoice(media_id);
            } else {
              const { audioBase64 } = res as ResSpeechText;
              console.log(audioBase64);
              alert('音频>60s 走降级方案');
            }
          });
        }

        setLoading(false);
      } else {
        setLoading(false);
      }
    },
  };
  const session: Session = {
    name: 'test',
    id: '1',
    assistantId: 'sd',
  };
  const now = Date.now();
  const assistant: Assistant = {
    id: `${now}`,
    name: '语文老师',
    prompt:
      'You are a Chinese teacher, No matter what I say, you should answer with chinese',
    temperature: 0.7,
    max_log: 40,
    max_tokens: 500,
    model: 'gpt-3.5-turbo',
    mode: 'dialog',
    voiceModel: 'tts-1',
    voiceType: 'alloy',
  };
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessageList, getMessageList] =
    useGetState<MessageList>([]);
  const inputState = useSelector(getInputState);

  const setSuggestion = (suggestion: string) => {
    if (suggestion === '') return;
    const len = messages.length;
    const lastMsg = messages[len - 1];
    let newList: MessageList = [];
    if (lastMsg?.role === 'assistant') {
      lastMsg.content = suggestion;
      newList = [...messages.slice(0, len - 1), lastMsg];
    } else {
      const newMsg: Message = {
        id: `${Date.now()}`,
        sessionId: session.id,
        role: 'assistant',
        // -1 先标识为语音
        // audioKey: getMode() === 'audio' ? -1 : undefined,
        audioState: 'loading',
        content: suggestion,
      };
      newList = [...messages, newMsg];
      // messageStore.addMessage(newMsg);
    }
    // scrollRef.current!.scrollTop += 200;
    setMessageList(newList);
  };
  const user = useSelector(getUserState) as ResUserInfo;
  const onSubmit = (_prompt: string) => {
    const newPrompt = prompt.trim() || _prompt;
    if (!newPrompt) return;
    if (loading) {
      chatService.cancel();
      return;
    }
    const _msgs = getMessageList();
    const lastMsg: Message = {
      id: `${Date.now()}`,
      role: 'user',
      content: newPrompt,
      sessionId: session.id,
      // audioKey,
    };
    // messageStore.addMessage(lastMsg);
    let list: MessageList = [..._msgs, lastMsg];
    setLoading(true);
    setMessageList(list);
    // requestIdleCallback safari不兼容
    // setTimeout(() => {
    //   scrollRef.current!.scrollTop += 200;
    // }, 100);
    chatService.getStream({
      prompt,
      history: list.slice(-assistant!.max_log).map((it) => {
        const newIt: any = {
          role: it.role,
          content: it.content,
        };
        return newIt as SendMessage;
      }),
      options: assistant,
    });
    setPrompt('');
  };
  const playVoice = (serverId: string) => {
    window.wx.downloadVoice({
      serverId,
      isShowProgressTips: 0, // 默认为1，显示进度提示
      success: function (res: any) {
        var localId = res.localId; // 返回音频的本地ID
        window.wx.playVoice({
          localId,
        });
      },
      error() {
        alert('下载失败');
      },
    });
  };
  const toSpeak = async (item: Message, i: number) => {
    console.log('---toSpeak', item, i);
  };
  return (
    <div className='h-full w-full flex flex-col justify-between'>
      {!user.isLogin ? (
        <Welcome />
      ) : (
        <>
          <NavHeader></NavHeader>
          <div className='flex-col h-full flex-1 overflow-y-auto items-start'>
            {messages.map((item, idx) => {
              const isUser = item.role === 'user';
              return (
                <div
                  key={`${item.role}-${idx}`}
                  className='pt-4 pb-4 px-4'
                  style={{
                    backgroundColor: isUser ? '#fff' : '#f3f3f3',
                  }}>
                  <div className='flex flex-row'>
                    <div
                      className={clsx(
                        'flex-none',
                        'mr-3',
                        'rounded-full',
                        'h-8',
                        'w-8',
                        'flex',
                        'justify-center',
                        'items-center',
                        'overflow-hidden'
                      )}>
                      {!isUser ? (
                        <img
                          alt='ai'
                          src='/imgs/ai-3.5.jpeg'
                          className='w-8 rounded-full'
                        />
                      ) : user.headimgurl ? (
                        <img alt='you' src={user.headimgurl} />
                      ) : (
                        <IconUser color='#333' size={20} />
                      )}
                    </div>
                    <MessageContent
                      index={idx}
                      message={item}
                      toSpeak={toSpeak}
                      showWriting={
                        idx === messages.length - 1 && loading
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* <button onClick={() => playVoice()}>playVoice</button> */}

      <FooterInput
        prompt={prompt}
        setPrompt={setPrompt}
        submit={onSubmit}></FooterInput>
    </div>
  );
}
