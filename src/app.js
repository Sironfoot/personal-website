var express = require('express');
var swig = require('swig');
var favicon = require('serve-favicon');

global.__rootDir = __dirname;
global.local = require('loquire')({ rootDir: __rootDir });

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __rootDir + '/views');
swig.setDefaults({ cache: false });

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__rootDir + '/public'));

var homeController = local('/controllers/home');
app.route('/').get(homeController.index);

app.use(function(req, res) {
    if (req.xhr) {
        res.json(404, { error: '404 - Not found.' });
    }
    else {
        res.send(404, '404 - Not found.');
    }
});

// 500 error handling
app.use(function(err, req, res, next) {
    if (req.xhr) {
        res.json(500, {
            error: err.toString(),
            stack: err.stack
        });
    }
    else {
        res.type('text/html');
        res.send(500, 'Error was thrown: <br /><br />' + (err.stack ? err.stack.replace(/\n/ig, '<br />&nbsp;&nbsp;&nbsp;&nbsp;') : ''));
    }
});

app.listen(8888, function() {
    console.log('Listening on http://localhost:8888'); 
});