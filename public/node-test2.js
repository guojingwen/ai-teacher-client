const fetch = require('node-fetch');
const fs = require('fs');

// 读取要上传的文件
const file = fs.readFileSync('要上传的文件路径');

// 设置上传的URL和文件名
const url = '服务器上传地址';
const fileName = '上传文件名';

// 构建FormData对象
const formData = new FormData();

formData.append('media', blob, fileName);

// 发送POST请求上传文件
fetch(url, {
  method: 'POST',
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log('文件上传成功！', data);
  })
  .catch((error) => {
    console.error('文件上传失败！', error);
  });
