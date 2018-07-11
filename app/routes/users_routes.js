const loggedIn = require('../lib/session').loggedIn;
const memberOfProject = require('../lib/session').memberOfProject;
const projectRights = require('../lib/session').projectRights;
const readProjects = require('../lib/access_project_json').readProjects;
const { readUsers, createUser, readUser, updateUser, deleteUser } = require('../lib/access_user_json');


module.exports = function(app, db) {
  /** LIST USERS */
  app.get('/users', (req, res) => {
    if(loggedIn(req.query)){
      const users = readUsers();
      res.send(JSON.stringify(users));
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  })

  /** CREATE USERS */
  app.post('/users', (req, res) => {
    res.send({
      success:true,
      shot: createUser(req.body, req.query.userid)
    });
  });

  /** UPDATE USER BY ID */
  app.put('/users/:id', (req, res) => {
    if (loggedIn(req.query)) {
      res.send(updateUser(
        req.query.userid,
        req.params.id,
        req.body
      ));
      return
    }
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** DELETE USER */
  app.delete('/users/:id', (req, res) => {
    if (loggedIn(req.query)) {
      res.send(deleteUser(req.query.userid));
      return 
    }
    res.send({ error: 'ACCESS_DENIED'});
  });

}