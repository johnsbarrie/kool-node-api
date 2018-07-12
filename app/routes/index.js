const projectRoutes = require('./projects_routes');
const shotRoutes = require('./shots_routes');
const sessionRoutes = require('./session_routes');
const memberRoutes = require('./members_routes');
const userRoutes = require('./users_routes');
const timelineRoutes = require('./timelines_routes');
const imageRoutes = require('./images_routes');

module.exports = function(app, db) {
  shotRoutes(app, db);
  projectRoutes(app, db);
  sessionRoutes(app, db);
  memberRoutes(app, db);
  userRoutes(app, db);
  timelineRoutes(app, db);
  imageRoutes(app,db);
};