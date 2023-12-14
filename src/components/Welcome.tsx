export default function Welcome() {
  const kinds = [
    {
      id: 1,
      icon: 'http://localhost:8080/imgs/create.svg',
      name: 'AI 创作',
    },
    {
      id: 2,
      icon: 'http://localhost:8080/imgs/study.svg',
      name: 'AI 学习',
    },
    {
      id: 3,
      icon: 'http://localhost:8080/imgs/baike.svg',
      name: 'AI 百科',
    },
  ];
  const lists = [
    [
      { text: '写一篇科幻小说' },
      { text: '写一条给女友的短信' },
      { text: '安排一场发布会流程' },
    ],
    [
      {
        text: '跟AI学英语单词',
      },
      {
        text: '跟AI学中文',
      },
      {
        text: '跟AI学编程',
      },
    ],
    [
      {
        text: '地锅鸡的做法',
      },
      {
        text: '生活中有哪些有趣的化学实现',
      },
      {
        text: '人工智能会替代人类工作吗',
      },
    ],
  ];
  return (
    <div className='flex flex-col h-full w-full items-center justify-center'>
      <div className='flex w-full justify-evenly'>
        {kinds.map((kind) => (
          <div key={kind.id} className='flex flex-col items-center'>
            <svg
              width='32'
              height='32'
              xmlns='http://www.w3.org/2000/svg'>
              <image href={kind.icon} width='32' height='32' />
            </svg>
            <span className='mt-1.5 text-base'>{kind.name}</span>
          </div>
        ))}
      </div>
      <div className='flex w-full justify-evenly mt-4'>
        {lists.map((subList, key) => (
          <div key={key} className='w-24 overflow-hidden flex-none'>
            {subList.map((it, index) => (
              <div
                className='bg-gray-100 mt-3 px-2 py-2 rounded'
                key={index}>
                {it.text}
                <svg
                  className='inline-block ml-1'
                  width='14'
                  height='14'
                  xmlns='http://www.w3.org/2000/svg'>
                  <image
                    href='http://localhost:8080/imgs/arrow.svg'
                    width='14'
                    height='14'
                  />
                </svg>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
