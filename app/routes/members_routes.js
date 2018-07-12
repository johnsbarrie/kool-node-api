const loggedIn = require('../lib/session').loggedIn;
const { memberOfProject } = require('../lib/session');
const { rightsForProject } = require('../lib/session');
const { readProjects } = require('../lib/access_project_json');
const { readMembers, createMember, updateMember, deleteMember } = require('../lib/access_member_json');


module.exports = function(app, db) {

  /** LIST SHOTS */
  app.get('/projects/:project_id/members/', (req, res) => {
    const rights = rightsForProject(req);
    if(loggedIn(req.query) && rights && rights['canReadProject']){
      
      const members = readMembers().filter(function(member){
        return (member.projectid === req.params.project_id)
      });

      res.send(JSON.stringify(members));
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  })

  /** CREATE SHOTs */
  app.post('/projects/:project_id/members/', (req, res) => {
    const rights = rightsForProject(req);
    if (loggedIn(req.query) && rights && rights.canEditProject){
      res.send({
        success:true,
        member: createMember(req.body, req.params.project_id)
      });
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  });

  /** SHOT BY ID */
  app.get('/projects/:project_id/members/:id', (req, res) => {
    const rights = rightsForProject(req);
    if (project.status === 'public' || (loggedIn(req.query) && rights.canReadProject)) {
      
      res.send(readShot(req.params.id, project.id));
      return 
    };
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** UPDATE SHOT BY ID */
  app.put('/projects/:project_id/members/:id', (req, res) => {
    const rights = rightsForProject(req);
    if (loggedIn(req.query) && rights.canEditProject) {
      res.send(updateMember(
        req.body,
        req.params.project_id
      ));
      return
    }
    res.send({ error: 'ACCESS_DENIED'});
  });

  /** DELETE SHOT */
  app.delete('/projects/:project_id/members/:id', (req, res) => {
    const rights = rightsForProject(req);

    if (loggedIn(req.query) && rights.canEditProject) {
      res.send(deleteMember(req.params.id, req.params.project_id));
      return 
    }

    res.send({ error: 'ACCESS_DENIED'});
  });

}