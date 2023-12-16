export async function fetchChat(content: string) {
  const resp = await fetch('/api/openai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'text/event-stream',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '你是一个智慧的AI助手，任务是详细地回答用户的每一个问题',
        },
        { role: 'user', content },
      ],
      stream: true,
      // ...options,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });
  console.log('开始解析');
  const data = resp.body!;
  const reader = data.getReader();
  let done = false;
  while (!done) {
    const { value, done: doneReadingStream } = await reader.read();
    done = doneReadingStream;

    if (!done) {
      const str = Uint8ArrayToString(value!);
      console.log(str);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
function Uint8ArrayToString(fileData: Uint8Array) {
  var dataString = '';
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString;
}

export type WoiceModel = 'tts-1' | 'tts-1-hd';
export type VoiceType =
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';
export interface SpeechTextParams {
  model: WoiceModel;
  voice: VoiceType;
  input: string;
}
export async function fetchSpeechText(input: string) {
  const params: SpeechTextParams = {
    model: 'tts-1',
    voice: 'alloy',
    input,
  };
  const res = await fetch('/api/openai/speechToText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then((res) => res.json());
  return res as { audioBase64: string };
}

export interface ResWxUpload {
  type: 'voice';
  media_id: string;
  created_at: number;
  item: any[];
}
export async function fetchSpeechText2(input: string) {
  const params: SpeechTextParams = {
    model: 'tts-1',
    voice: 'alloy',
    input,
  };
  const res = await fetch('/api/openai/speechToText2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then((res) => res.json());
  return res as ResWxUpload;
}
