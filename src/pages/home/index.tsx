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

export default function Home() {
  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: (sug: string) => {
      console.log('---onCompleted', sug);
      setLoading(false);
      // if (getMode() === 'text') {
      //   setLoading(false);
      // } else {
      //   _resolve?.(sug);
      //   setLoading(false);
      // }
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
  const setSuggestion = (suggestion: string) => {
    if (suggestion === '') return;
    console.log(suggestion);
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
      // messageStore.addMessage(newMsg);
    }
    // scrollRef.current!.scrollTop += 200;
    setMessageList(newList);
  };
  const user = useSelector(getUserState);
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
  return (
    <div className='h-full w-full flex flex-col justify-between'>
      {!user.isLogin ? (
        <Welcome />
      ) : (
        <div>
          <NavHeader></NavHeader>
        </div>
      )}
      <FooterInput
        prompt={prompt}
        setPrompt={setPrompt}
        submit={onSubmit}></FooterInput>
    </div>
  );
}
