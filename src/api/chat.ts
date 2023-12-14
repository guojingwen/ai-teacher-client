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

export async function fetchChat2(prompt: string) {
  return new Promise((resolve) => {
    const source = new EventSource('/api/stream', {
      withCredentials: false,
    });
    source.onopen = function (event) {
      // ...
      console.log('sse open', event);
    };
    source.onmessage = function (event) {
      var data = event.data;
      var origin = event.origin;
      var lastEventId = event.lastEventId;
      // handle message
      console.log(data, origin, lastEventId);
    };
    source.onerror = function (event) {
      // 客户端没有onclose方法， 服务端关闭会触发 onerror方法
      console.log('sse onerror', event);
    };
    // source.onclose = function (event) {
    //   // ...
    //   console.log('sse onclose', event);
    // };
  });
}
