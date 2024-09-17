import net from "node:net";
import {decoding} from "./decoding";

const host = "192.168.1.66"
const port = 66

const client = new net.Socket();

//FF 00 02 02 0D
const buffer1 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0xC1, 0x00, 0x00, 0x01, 0xF4]);
// const buffer2 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0xC2, 0x00, 0x00, 0x00, 0x00, 0x09, 0x01, 0x00, 0x20, 0x05, 0x05]);
//ff 00 02 02 C2 02 00 00 00 0C 04 00 20 01 01 08 20 01 01 16 04 01 01 17 04 01 01
const buffer4 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0xC2, 0x02, 0x00, 0x00, 0x00, 0x0C, 0x04, 0x00, 0x20, 0x01, 0x01, 0x08, 0x20, 0x01, 0x01, 0x16, 0x04, 0x01, 0x01, 0x17, 0x04, 0x01, 0x01]);
const buffer3 = Buffer.from([0xff, 0x00, 0x02, 0x02, 0x0E]);


client.connect(66, host, () => {
  console.log("Connected");
  // setTimeout(() => {
  //   console.log("send1")
  //   client.write(buffer0);
  // }, 1500);
  setTimeout(() => {
    console.log("send1")
    client.write(buffer1);
  }, 2500);
  // setTimeout(() => {
  //   console.log("send1")
  //   client.write(buffer2)
  // }, 3500);

  setTimeout(() => {
    console.log("send1")
    client.write(buffer4)
  }, 4000);


  setTimeout(() => {
    console.log("send1")
    client.write(buffer3);
  }, 4500);
});


// 打印接收到的消息
client.on('data', (data: Buffer) => {
  console.log(data)
  console.log(decoding(data))
});

// @ts-ignore
client.on('error', (err) => {
  console.error('Connection error: ', err);
});

