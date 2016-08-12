// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.


fs = require('fs');
// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
  console.log("Nineth task: " + util.inspect(global));
};

module.exports.func = function(args) {
  console.log("[eighth task] function with argument: " + args);
};

var str = util.format("My %d%s", 2, "nd task");
console.log(str);

setTimeout(function(){
	console.log("some text from setTimeout");
}, 1000);

setInterval(function(){
	console.log("some text from setInterval");
}, 1000);