# 说明
实际上是在研究canjs的Observe写得原理说明性的代码。
随便搞搞，不支持嵌套也不搞乱七八糟的容错处理

# 用法

```
  /*创建一个Observe*/
    var a = new Observe({name: 'ted'});
    var b = new Observe({name: 'zhou'});

    /*然后监听它的变化**/
    a.bind('change', function (type, o, n) {
            console.log('change 自己');
            console.log(type == 'change');
            console.log(o == 'ted');
            console.log(n == 'me')
        });

    /*支持compute，也就是监听一个函数的值（由observer组成的值）*/
    var computed = Observe.compute(function () {
	    return a.attr('name') + b.attr('name');
    });
	computed.bind('change', function (type, o, n) {
		console.log('computed 测试')
		console.log(type == 'change');
		console.log(o === 'ted' + 'zhou');
		console.log(n === 'me' + 'zhou');
    });

	/*然后就开始变啊变*/
    a.attr('name', 'me');

```
