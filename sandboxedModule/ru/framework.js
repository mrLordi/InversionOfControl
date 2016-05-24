// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

//test string

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {},
 				console: clone(console),
 				setTimeout: setTimeout,
 				setInterval: setInterval,
 				util: util,
 				require: sixthTask 
 			};
context.global = context;
var sandbox = vm.createContext(context);

var keys = {};
for (var element in sandbox) {
	keys[element] = sandbox[element];
}

// Читаем исходный код приложения из файла
var fileName = process.argv[2] || './application.js';
fs.readFile(fileName, function(err, src) {
	// Тут нужно обработать ошибки
  
	// Запускаем код приложения в песочнице
	var script = vm.createScript(src, fileName);
	script.runInNewContext(sandbox);

	var newKeys = {};
  	for (var element in sandbox) {
		newKeys[element] = sandbox[element];
  	}

  	console.log("New keys:");
  	for (var element in newKeys) {
		if (!(element in keys)) {
			console.log(element);
		}
  	}
  
	// Забираем ссылку из sandbox.module.exports, можем ее исполнить,
	// сохранить в кеш, вывести на экран исходный код приложения и т.д.
	for (var element in sandbox.module.exports) {
  		console.log(element + " : " + typeof sandbox.module.exports[element]);
	}

	var functions = sandbox.module.exports.func.toString();
	var arguments = functions.substring(functions.indexOf("(") + 1, functions.indexOf(")"));
	var pos = 0;
	var count = 0;
	
	while(true) {
	  var found = arguments.indexOf(",");
	  
	  if(found == -1) {
	  	break;
	  } else { 
	  	count++;
	  }

	  pos = found + 1;
	}

	console.log(functions);
	console.log(count + 1);

	sandbox.module.exports();

});

function clone(obj) {
	var result = {};

	for (var i in obj) {
		result[i] = obj[i];
	}

	return result;
}

context.console.log = function (message){
	var time = new Date().toLocaleTimeString();
	console.log(fileName + " " + time + " " + message);
	var out = fs.createWriteStream('output.txt', {flags: 'a+'});
	out.write(fileName + " " + time + " " + message + '\n');
}

function sixthTask(module) {
	var time = new Date().toLocaleTimeString();
	console.log(time + " " + module);
	return require(module);
}