const loggedIn = require('../lib/session').loggedIn;
const memberOfProject = require('../lib/session').memberOfProject;
const projectRights = require('../lib/session').projectRights;
const readProjects = require('../lib/access_project_json').readProjects;
const readUsers = require('../lib/access_project_json').readUsers;

const readShot = require('../lib/access_shot_json').readShot;
const createShot = require('../lib/access_shot_json').createShot;
const updateShot = require('../lib/access_shot_json').updateShot;
const deleteShot = require('../lib/access_shot_json').deleteShot;

module.exports = function(app, db) {


  /** LIST SHOTS */
  app.get('/projects/:project_id/shots/', (req, res) => {
    console.log('list shots ',  req.params.project_id)

    const project = readProjects().find(function (p) {
      return p.id === req.params.project_id
    });

    const member = memberOfProject(req.query.userid, req.params.project_id);
    const rights = projectRights(member, project.status);
    if(loggedIn(req.query) && rights && rights.canReadProject){
      
      const shots = readShots().filter(function(shot){
        return (shot.projectid === req.params.project_id)
      }).map(function(shot){
        const creatorUser = readUsers().filter(function(user) {
          return (user.id === shot.userid);
        }).pop();
        shot.user = creatorUser.user
        return shot
      });

      res.send(JSON.stringify(shots));
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  })

  /** CREATE SHOTs */
  app.post('/projects/:project_id/shots/', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.project_id
    });

    const member = memberOfProject(req.query.userid, req.params.project_id);
    const rights = projectRights(member, project.status);
    if (loggedIn(req.query) && rights && rights.canCreateShots){
      res.send({
        success:true,
        shot: createShot(req.body, project.id, req.query.userid)
      });
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  });

  /** SHOT BY ID */
  app.get('/projects/:project_id/shots/:id', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.project_id
    });
    
    const member = memberOfProject(req.query.userid, req.params.project_id);
    const rights = projectRights(member, project.status);
    if (project.status === 'public' || (loggedIn(req.query) && rights.canReadProject)) {
      
      res.send(readShot(req.params.id, project.id));
      return 
    };
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** UPDATE SHOT BY ID */
  app.put('/projects/:project_id/shots/:id', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.project_id
    });

    const member = memberOfProject(req.query.userid, req.params.project_id);
    const rights = projectRights(member, project.status);
    if (loggedIn(req.query) && rights.canCreateShots) {
      res.send(updateShot(
        req.query.userid,
        req.body,
        req.params.project_id,
        req.params.id
      ));
      return
    }
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** DELETE SHOT */
  app.delete('/projects/:project_id/shots/:id', (req, res) => {
    console.log('delete shots ',  req.params)
  });

}