// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: wrapAll(fs),
  setTimeout: setTimeout,
  setInterval: setInterval,
  printInformation: printInformation
};

var sandbox = vm.createContext(context);
var countCallFunction = 0;
var coutCallBack = 0;
var avgTime = 0;

function cloneInterface(anInterface) {
	var clone = {};
    for (var key in anInterface) {
    	clone[key] = anInterface[key];
    }
    return clone;
}

function wrapFunction(fnName, fn) {
    return function wrapper() {
      var args = [];
      countCallFunction++;
      Array.prototype.push.apply(args, arguments);

      console.log('Call: ' + fnName);
      //console.dir(args);

      if(typeof args[args.length - 1] === 'function' ) {
         args[args.length - 1] = wrapFunction(fnName + ' : callback',
         	args[args.length - 1]);
         coutCallBack++;
      }

      var start = process.hrtime();
      var result = fn.apply(undefined, args);
      var end = process.hrtime(start);
      var timeS = end[0] + (end[1] / 1000000000);
      avgTime = ((countCallFunction - 1)*avgTime + timeS)/countCallFunction;
      return result;
    }
  }

function wrapAll(api) {
	var wraperedApi = cloneInterface(api);
	for(var key in wraperedApi) {
	   if(typeof wraperedApi[key] === 'function') {
	       wraperedApi[key] = wrapFunction(key, wraperedApi[key]);
	   }
	}
	return wraperedApi;
}

function printInformation(){
	console.log('--------Iformation---------');
	console.log('Calls: ' + countCallFunction);
	console.log('CallBack: ' + coutCallBack);
    console.log('Time: ' + avgTime + ' s');
    console.log('---------------------------');
}

// Преобразовываем хеш в контекст
context.global = context;

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});

