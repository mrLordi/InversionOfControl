// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.


util = require('util');
// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
  console.log(util.inspect(global));
};

module.exports.func = function(args) {
  console.log("[seventh task] function with argument: " + args);
};

setTimeout(function(){
	console.log("some text");
}, 1000);

setInterval(function(){
	console.log("some text");
}, 1000);

var str = util.format("My %d %s", 2, "task");
console.log(str);