import {createConnection} from "net"


const client = createConnection({port: 9001}, () => {
  console.log(client.localPort)
  console.log('Connected to server!');
});

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('Disconnected from server');
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});



const client1 = createConnection({port: 9001}, () => {
  console.log(client1.localPort)
  console.log('Connected to server!');
});

client1.on('data', (data) => {
  console.log(data.toString());
});

client1.on('end', () => {
  console.log('Disconnected from server');
});

client1.on('error', (err) => {
  console.error('Connection error:', err);
});

