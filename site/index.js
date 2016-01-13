var Server = require('./server');


var Site = module.exports = function (sitePort1, sitePort2, viewsPath) {
    this.sitePort1 = sitePort1;
    this.sitePort2 = sitePort2;
    this.basePath  = viewsPath;

    this.server1 = null;
    this.server2 = null;
};

Site.prototype.create = function () {
    this.server1 = new Server(this.sitePort1, this.basePath);
    this.server2 = new Server(this.sitePort2, this.basePath);
};

Site.prototype.destroy = function () {
    this.server1.close();
    this.server2.close();
};