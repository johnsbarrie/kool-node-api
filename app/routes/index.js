const projectRoutes = require('./projects_routes');
const shotRoutes = require('./shots_routes');
const sessionRoutes = require('./session_routes');
module.exports = function(app, db) {
  shotRoutes(app, db);
  projectRoutes(app, db);
  sessionRoutes(app, db);
};