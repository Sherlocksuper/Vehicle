/**
 * transfer the history to a file
 */

self.onmessage = (event) => {
    const result = event.data;
    const file = new File([JSON.stringify(result)], 'result.json', {type: 'application/json'})
    self.postMessage(file)
}
