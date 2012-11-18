# Roots Express

Live reload and auto-loaded roots css library from the [roots build system](http://github.com/jenius/roots-cli), ported to express.

Installation
------------

Installation is quick and fairly straightforward. After you have created a new express application, add `roots-express` to your package.json file and run `npm install`.

Then you need to make a couple modifications to your `app.js` file to wire everything together. First, make sure you require roots-express, as such:

    var roots = require('roots-express');

Then, add the following line inside your `app.configure` block:

    app.use(require('stylus').middleware({ src: __dirname + '/public', compile: roots.middleware }));

...this will set up stylus and auto-load the roots css library for you. Finally, at the bottom of the file, you should see a line something like this:

    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });

Change it to look more like this, so roots can keep an eye on your folders and live-reload the browser:

    var server = http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });

    roots.watch(server);

Finally, inside your layout file, add the following line anywhere (at the bottom of the body is probably best):

    != livereload

...that should do the trick! You now have live reloading whenever views or assets are changed, and the roots css library is available in all stylus files automatically.

Future
------

Since this setup is kind of a pain and can become repetitive, the roots command line tool will soon include a command like `roots new --express` that will automatically generate the right setup for you. For now, making the modifications above should be enough to do it : )