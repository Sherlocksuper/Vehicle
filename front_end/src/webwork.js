self.onmessage = function(e) {

    console.log('Worker: Message received from main script');
    const workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    console.log('Worker: Posting message back to main script');

    self.postMessage(workerResult);
}