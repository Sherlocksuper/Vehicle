export const createConnection = (onMessage: (event: MessageEvent) => void) => {
  const eventSource = new EventSource(`http://localhost:8081/startConnection`, {
  });

  eventSource.addEventListener("message", (e) => {
    onMessage(e.data);
  });

  eventSource.addEventListener("myerror", (e) => {
  });

  eventSource.addEventListener("error", (e) => {

  });
};
