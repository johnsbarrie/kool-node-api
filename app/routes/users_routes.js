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
    const result = createUser(req.body)
    
    if (result.error) {
      res.send({
        success:false,
        error: result.error
      });
    } else {
      res.send({
        success:true,
        
      });
    }
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
}