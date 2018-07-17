const { loggedIn } = require('../lib/session');
const { rightsForProject } = require('../lib/session');
const { readUsers } = require('../lib/access_project_json');
const { readShot, createShot, updateShot, deleteShot } = require('../lib/access_shot_json');


module.exports = function(app, db) {
  /** LIST SHOTS */
  app.get('/projects/:project_id/shots/', (req, res) => {
    const rights = rightsForProject(req);
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
    const rights = rightsForProject(req);
    if (loggedIn(req.query) && rights && rights.canCreateShots){
      res.send({
        success:true,
        shot: createShot(req.body, req.params.project_id, req.query.userid)
      });
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  });

  /** SHOT BY ID */
  app.get('/projects/:project_id/shots/:id', (req, res) => {
    const rights = rightsForProject(req);
    if (project.status === 'public' || (loggedIn(req.query) && rights.canReadProject)) {
      res.send(readShot(req.params.id, project.id));
      return 
    };
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** UPDATE SHOT BY ID */
  app.put('/projects/:project_id/shots/:id', (req, res) => {
    const rights = rightsForProject(req);
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
    const rights = rightsForProject(req);

    if (loggedIn(req.query) && rights.canCreateShots) {
      res.send(deleteShot(req.query.userid, req.params.project_id, req.params.id));
      return 
    }

    res.send({ error: 'ACCESS_DENIED'});
  });

}