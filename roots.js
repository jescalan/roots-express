var path = require('path'),
    watcher = require('./watcher'),
    stylus = require('stylus'),
    roots_css = require('roots-css'),
    WebSocket = require('faye-websocket'),
    ws;

// @api public
// - sets up the live reload server and file watcher
// - adds livereload view helper

exports.watch = function(server){

  // start the file watcher
  var views = path.join(__dirname, '../..', 'views');
  var assets = path.join(__dirname, '../..', 'public');
  watcher.watchDirectories([views, assets], function(){
    ws && ws.send('reload');
  });

  // set up websockets
  server.addListener('upgrade', function(request, socket, head) {
    ws = new WebSocket(request, socket, head);
    ws.onopen = function(){ ws.send('connected'); }
  });

  // middleware to inject socket code function
  if (process.env.NODE_ENV == 'production') {
    global.livereload = "";
  } else {
    global.livereload = "<script>protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'; address = protocol + window.location.host + window.location.pathname + '/ws'; socket = new WebSocket(address); socket.onmessage = function(msg) { console.log(msg.data); msg.data == 'reload' && window.location.reload() }</script>";
  }

}

// @api public
// - makes roots css available to stylus
// - usage (in express app.js file):
//   app.use(require('stylus').middleware({ src: __dirname + '/public', compile: roots.middleware }));

exports.middleware = function(str, path) {
  return stylus(str).set('filename', path).use(roots_css());
}

exports.add_compiler = function(assets){
  assets.cssCompilers.styl = {
    optionsMap: {},
    compileSync: function(sourcePath, source) {
      var callback, options, result, _base, _ref;
      result = '';
      
      callback = function(err, js) {
        if (err) { throw err; }
        return result = js;
      };

      options = (_ref = (_base = this.optionsMap)[sourcePath]) != null ? _ref : _base[sourcePath] = {
        filename: sourcePath
      };

      stylus(source, options).use(roots_css()).set('compress', this.compress).set('include css', true).render(callback);
      return result;
    }
  }
}