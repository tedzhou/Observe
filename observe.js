/**
 * Created with IntelliJ IDEA.
 * User: ted
 * Date: 13-5-24
 * Time: 下午7:42
 * To change this template use File | Settings | File Templates.
 *
 * 简单到死的observer
 */

/**
 * 构造器
 * @param prop 只支持一种传参方式，就是 new Observe({name:'name'});
 * @returns {*} 返回一个observer
 * @constructor
 */
var Observe = function (prop) {
	if (!this.isObserving) {
		this.__set(prop);
		this.isObserving = true;
	} else {
		return this;
	}
};

/**
 * 读写接口，有value就是写
 * @param name
 * @param [value]
 * @returns {*}
 */
Observe.prototype.attr = function (name, value) {
	Observe.__catching(this);
	if (value) {
		/** 我是有多蛋疼才写出这种代码 **/
		var obj = {};
		obj[name] = value;
		this.__set(obj);
		return this;
	}
	return this[name];
};

/**
 * 事件绑定方法，type只支持change和add
 * @param type
 * @param fn
 */
Observe.prototype.bind = function (type, fn) {
	this._binding || (this._binding = []);
	this._binding[type] || (this._binding[type] = []);
	this._binding[type].push(fn);
	return this;
};

/**
 * 其实是用来Observe一个函数的
 * 应该重载到new Observe(fun)构造器里面的，先偷个懒
 * @param fun
 * @returns {Observe}
 */
Observe.compute = function (fun) {
	var obs = this.__getObserveAndValue(fun);
	var observing = obs.observing;
	var value = obs.value;
	var computed = new Observe({value: value});

	var changing = function () {
		computed.attr('value', fun());
	};
	observing.forEach(function (o) {
		o.bind('change', changing).bind('add', changing);
	});

	return computed;
};

/**
 * 用来偷换作用域的
 * @private
 */
Observe.__catching = function () {
};
/**
 * 写接口
 * @param prop 放入prop，然后写this[key]=value
 * @private
 */
Observe.prototype.__set = function (prop) {
	for (var i in prop) {
		if (prop.hasOwnProperty(i)) {
			var o = this[i];
			var n = prop[i];
			if (o != n) {
				var type = '';
				if (o === undefined) {
					type = 'add';
				} else {
					type = 'change';
				}
				this[i] = n;
				if (this._binding && this._binding[type]) {
					var self = this;
					this._binding[type].forEach(function (fn) {
						fn.call(self, type, o, n);
					});
				}
			}

		}
	}
};

/**
 * compute的辅助方法，获取computed的fun里面需要监听哪个对象，顺便拿下fun的value回去。
 * @param b
 * @returns {{observing: Array, value: *}}
 * @private
 */
Observe.__getObserveAndValue = function (b) {
	var observing = [];
	var oldCatching = Observe.__catching;
	Observe.__catching = function (o) {
		observing.push(o);
	};
	var value = b();
	Observe.__catching = oldCatching;
	return {
		observing: observing,
		value: value
	};
};
