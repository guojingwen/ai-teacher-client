const fs = require('fs');

// 将Base64数据转换为File对象
function base64ToFile(base64Data, outputFilePath) {
  const base64String = base64Data.split(';base64,').pop();
  const fileData = Buffer.from(base64String, 'base64');

  const blob = new Blob([fileData]);
  const file = new File([blob], outputFilePath);

  // 保存文件到本地
  fs.writeFileSync(outputFilePath, fileData);

  return file;
}

function fetchReq() {
  const base = 'https://api.weixin.qq.com/cgi-bin/media/upload';
  const access_token =
    '75_xHcQlnVZOqoxC1IhfROnqttFre08n6wpFMYrSm046RKfNbTydtIdwTQmiUPhXJk1lvwJeBI3cYRYhnIuji32aZbqRbR72EmADsNeu3jfnpT5ShUISixFWZdo2ugPGEhACAARP';
  const form = new FormData();
  return fetch(`${base}?access_token=${access_token}&type=voice `, {
    method: 'POST',
    body: new FormData(),
    mode: 'cors',
  })
    .then((res) => res.json())
    .then((res) => {
      console.log('xxxx', res);
    });
}
