module.exports = function(app, router) {
    app.use(router, require('./dashboard-routes'));
};