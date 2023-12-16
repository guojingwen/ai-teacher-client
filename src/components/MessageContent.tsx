import { Message } from '@/types';
import { USERMAP } from '@/utils/constant';
import { IconSpeakerphone } from '@tabler/icons-react';
import { Markdown } from '@/components/Markdown';
import clsx from 'clsx';
import { ResUserInfo } from '@/api/apiType';
import { getUserState } from '@/store/userSlice';
import { useSelector } from 'react-redux';

const Colors = {
  loading: '#aaa',
  playing: 'red',
  done: 'green',
};
interface Props {
  message: Message;
  showWriting: boolean;
  index: number;
  toSpeak: (message: Message, i: number) => void;
}
export default function MessageContent({
  message: item,
  showWriting,
  index,
  toSpeak,
}: Props) {
  const user = useSelector(getUserState) as ResUserInfo;
  const isUser = item.role === 'user';
  let _theColor = Colors.loading;
  if (item.audioKey) {
    // 语音消息
    _theColor = Colors[item.audioState || 'done'];
  }

  return (
    <div className='flex flex-col'>
      <div className='text-base font-medium flex flex-row items-center'>
        {
          item.role === 'user'
            ? user.nickname
            : USERMAP[item.role] /*  + ' ' + item.audioKey */
        }
        {item.audioBase64 ? (
          <audio controls>
            <source src={item.audioBase64} />
          </audio>
        ) : (
          <IconSpeakerphone
            className='ml-1'
            color={_theColor}
            onClick={() => toSpeak(item, index)}
          />
        )}
      </div>
      <div
        className={clsx(
          {
            'whitespace-break-spaces': isUser,
          },
          'w-full',
          'max-w-sm',
          'min-h-[1rem]',
          'text-left'
        )}
        style={{ maxWidth: '18rem' }}>
        {isUser ? (
          <div>{item.content}</div>
        ) : (
          <Markdown
            markdownText={
              item.content +
              (showWriting
                ? `<span style='display: inline-block;width:0.8rem;height:0.8rem;border-radius:50%;background-color:#333;margin-left:0.1rem'><span>`
                : '')
            }></Markdown>
        )}
      </div>
    </div>
  );
}
