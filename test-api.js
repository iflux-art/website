const http = require("http");

// 测试 /api/links 端点
const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/links/",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const jsonData = JSON.parse(data);
      console.log("响应数据长度:", jsonData.length);
      console.log("前3个项目:", jsonData.slice(0, 3));
    } catch (e) {
      console.log("响应数据:", data);
    }
  });
});

req.on("error", (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

req.end();
