function Foo() {
  getName = function () {
    console.log(1)
  }
  return this
}

Foo.getName = function () {
  console.log(2)
}

Foo.prototype.getName = function () {
  console.log(3)
}

var getName = function () {
  console.log(4)
}


Foo.getName() // 2
getName() // node:5  浏览器：存疑
Foo().getName() // 1
getName()  // 1
new Foo.getName() // 1
new Foo().getName()
new new Foo().getName()
