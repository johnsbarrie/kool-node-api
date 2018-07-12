const loggedIn = require('../lib/session').loggedIn;
const memberOfProject = require('../lib/session').memberOfProject;
const projectRights = require('../lib/session').projectRights;
const { readProjects } = require('../lib/access_project_json');
const { readShot } = require('../lib/access_shot_json');
const { readTimeline, updateTimeline } = require('../lib/access_timeline_json');

const rightsForProject = function(req){
  const project = readProjects().find(function (p) {
    return p.id === req.params.project_id
  });

  const member = memberOfProject(req.query.userid, req.params.project_id);
  return projectRights(member, project.status) || {};
}

module.exports = function(app, db) {

  /** TIMELINE BY ID */
  app.get('/projects/:project_id/shots/:shot_id/timeline', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.project_id
    });
    const rights = rightsForProject(req);
    if (project.status === 'public' || (loggedIn(req.query) && rights.canReadProject)) {
      res.send(readTimeline(req.params.project_id, req.params.shot_id));
      return;
    };
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** UPDATE TIMELINE BY ID */
  app.put('/projects/:project_id/shots/:shot_id/timeline', (req, res) => {
    if (loggedIn(req.query)) {
      res.send(updateTimeline(
        req.body,
        req.params.project_id,
        req.params.shot_id
      ));
      return;
    }
    res.send({ error: 'ACCESS_DENIED'});
  });

}