// @ts-ignore
import WebSocket from 'ws';

export let webSockets: Set<WebSocket> = new Set()

export const addWebSocket = (ws: WebSocket) => {
  webSockets.add(ws)
}

export const removeWebSocket = (ws: WebSocket) => {
  webSockets.delete(ws)
}

export const sendMessage = (message: string) => {
  webSockets.forEach(ws => {
    ws.send(message)
  })
}
