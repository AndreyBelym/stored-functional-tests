var express = require('express');
var http    = require('http');
var fs      = require('fs');
var path    = require('path');

var CONTENT_TYPES = {
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.html': 'text/html',
    '.png':  'image/png'
};

var Server = module.exports = function (port, basePath) {
    var server = this;

    this.app       = express();
    this.appServer = http.createServer(this.app).listen(port);
    this.sockets   = [];
    this.basePath  = basePath;

    this._setupRoutes();


    this.appServer.on('connection', function (socket) {
        server.sockets.push(socket);

        socket.on('close', function () {
            server.sockets.splice(server.sockets.indexOf(socket), 1);
        });
    });
};

Server.prototype._setupRoutes = function () {
    var server = this;

    this.app.get('*', function (req, res) {
            var reqPath = req.params[0] || '';
            var resourcePath = path.join(server.basePath, reqPath);

            fs.readFile(resourcePath, function (err, content) {
                if (err)
                    res.sendStatus(404);
                else {
                    res.setHeader('content-type', CONTENT_TYPES[path.extname(resourcePath)]);
                    res.send(content);
                }
            });
        }
    );
};

Server.prototype.close = function () {
    this.appServer.close();
    this.sockets.forEach(function (socket) {
        socket.destroy();
    });
};
