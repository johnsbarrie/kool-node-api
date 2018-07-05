
const loggedIn = require('../lib/session').loggedIn;
const memberOfProject = require('../lib/session').memberOfProject;
const projectRights = require('../lib/session').projectRights;
const readProjects = require('../lib/access_json').readProjects;
const createProject = require('../lib/access_json').createProject;
const updateProject = require('../lib/access_json').updateProject;
const deleteProject = require('../lib/access_json').deleteProject;
const createMember = require('../lib/access_json').createMember;

const readMembers = require('../lib/access_json').readMembers;
const readUsers = require('../lib/access_json').readUsers;
const readShots = require('../lib/access_json').readShots;


module.exports = function(app, db) {

  /** LIST PROJECTS */
  app.get('/projects', (req, res) => {
    const projects = readProjects().map(
      function(project) {
        const ownerShip = readMembers().filter(
          function (member) {
            return (member.role === 'owner') && (member.projectid === project.id)
          }
        ).map(function (member) {
          const ownerUser = readUsers().filter(function(user) {
            return (member.userid === user.id);
          }).pop()
          return ownerUser.user
        }).pop();
        project.owner = ownerShip;
        return project;
      }
    );

    const publicProjects = projects.filter(function(project) {return (project.status==="public"); });
    var privateProjects = [];
    if (loggedIn(req.query)) {      
      privateProjects = projects.filter(
        function(project) {
          const memberShip = readMembers().filter(
            function(member) { 
              return (member.userid === req.query.userid) && (member.projectid === project.id)
            }
          );

          memberShip && (project.role = memberShip.role);
          return ((project.status === "private") && (memberShip.length > 0))
        }
      );
    }
    
    const resultProjects = publicProjects.concat(privateProjects);
    res.send(JSON.stringify(resultProjects));
  })

  /** PROJECTS BY ID */
  app.get('/projects/:id', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.id
    })

    const error = (!!project) ? null : "UNKNOWN_PROJECT";
    const result = {
      project: project,
      error
    }

    if (project) {
      project.shots = readShots().filter(function(shot){
        return (shot.projectid === req.params.id)
      }).map(function(shot){
        const creatorUser = readUsers().filter(function(user) {
          return (user.id === shot.userid);
        }).pop();
        shot.user = creatorUser.user
        return shot
      });

      const member = memberOfProject(req.query.userid, req.params.id);
      project.rights = projectRights(member, project.status);
    
    }
    if (project && project.rights.canReadProject) {      
      res.send(JSON.stringify(result));
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));
    }
  });

  /** UPDATE PROJECT BY ID */
  app.put('/projects/:id', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.id
    })
    const member = memberOfProject(req.query.userid, req.params.id);
    const rights = projectRights(member, project.status);
    if (loggedIn(req.query) && rights.canEditProject) {
      res.send(updateProject(req.body, req.params.id));
    } else {
      res.send({error: 'ACCESS_DENIED' });
    }
  });

  /** CREATE PROJECT */
  app.post('/projects', (req, res) => {
    if (!loggedIn(req.query)) {   
      res.send({error: 'NOT_LOGGED' });
    } else {
      setTimeout(function() {
        const createdProject = createProject(req.body);
        if (!createdProject.error) {
          createMember(createdProject.project.id, req.query.userid, 'owner');
        }
        
        res.send(createdProject);
      },3000);
    }
  });

  /** DELETE PROJECT */
  app.delete('/projects/:id', (req, res) => {
    if (!loggedIn(req.query)) {
      res.send({error: 'NOT_LOGGED' });
    } else {
      res.send(deleteProject(req.params.id));
    }
  });
};