const net = require("net")

const host = "192.168.1.66"
const port = 66

const client = new net.Socket();

//FF 00 02 02 0D
const buffer0 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0x0D]);
const buffer1 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0xC1, 0x00, 0x00, 0x01, 0xF4]);
const buffer2 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0xC2, 0x00, 0x00, 0x00, 0x00, 0x09, 0x01, 0x00, 0x20, 0x05, 0x05]);
const buffer3 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0x0E]);


client.connect(66, host, () => {
  console.log("Connected");
  setTimeout(() => {
    console.log("send1")
    client.write(buffer0);
  }, 1500);
  setTimeout(() => {
    console.log("send1")
    client.write(buffer1);
  }, 2500);
  setTimeout(() => {
    console.log("send1")
    client.write(buffer2)
  }, 3500);
  setTimeout(() => {
    console.log("send1")
    client.write(buffer3);
  }, 4500);
});


// 打印接收到的消息
client.on('data', (data) => {
  decoding(data)
});

client.on('error', (err) => {
  console.error('Connection error: ', err);
});


