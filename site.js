var Site           = require('./site/index.js');

var site = new Site(3002, 3003, './views');

site.create();