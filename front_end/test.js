
function test() {
  return new Promise((resolve, reject) => {
    console.log('test')
    setTimeout(() => {
      resolve('test');
    }, 1000);
  });
}

let promise = test();

promise.then((res) => {
  console.log(res);
});