
const { loggedIn } = require('../lib/session');
const { memberOfProject } = require('../lib/session');
const { allMembersOfProject } = require('../lib/session');
const { userWithID } = require('../lib/session');
const { projectRights } = require('../lib/session');
const { createProject, readProjects, 
        updateProject, deleteProject } = require('../lib/access_project_json');
const { createMember, readMembers, updateMember, deleteMember } = require('../lib/access_member_json');
const { readUsers } = require('../lib/access_project_json');
const { readShots } = require('../lib/access_shot_json');

module.exports = function(app, db) {

  /** LIST PROJECTS */
  app.get('/projects', (req, res) => {
    const projects = readProjects().map(
      function(project) {
        const members = allMembersOfProject(project.id)
          .map (function (member) {
            return { ...member, username: userWithID(member.userid).name };
          });
        project.members = members;
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
    const projectWithRights = resultProjects.map(function(project) {
      const rights = projectRights(memberOfProject(req.query.userid, project.id), project.status);
      return { ...project, rights: rights } ;
    })
    
    res.send(JSON.stringify(projectWithRights));
  })

  /** PROJECTS BY ID */
  app.get('/projects/:id', (req, res) => {
    const project = readProjects().find(function (p) {
      return p.id === req.params.id
    })

    const error = (!!project) ? null : { error: 'UNKNOWN_PROJECT'};
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

      const members = allMembersOfProject(req.params.id)
      .map (function (member) {
        return { ...member, username: userWithID(member.userid).name};
      })

      project.members = members;
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
    });

    const member = memberOfProject(req.query.userid, req.params.id);
    const rights = projectRights(member, project.status);
    
    if (loggedIn(req.query) && rights.canEditProject) {
      setTimeout(function() {
      if (req.body.members) {
        req.body.members.map((member) => {
          const existingMember = readMembers().find((m) => {
            return ((m.userid === member.userid) && (project.id === m.projectid))
          })
          
          if (existingMember) {
            updateMember(member, project.id);
          } else {
            createMember(member, project.id);
          }
        });

        const deletedUsers = allMembersOfProject(req.params.id).filter(member => {
            const memberStillIncluded = req.body.members.find(m => member.userid === m.userid);
            return !(memberStillIncluded)
          }
        )
        
        deletedUsers.map(m => deleteMember(m.userid, req.params.id))
      }
        res.send(updateProject(req.body, req.params.id));
      },500)
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
        const isMemberOfProjectWithSameTitle = !!(readProjects().filter(function (p) {
          return (p.title === req.body.title) && (memberOfProject(req.query.userid, p.id))
        }).length)
        
        if(!!isMemberOfProjectWithSameTitle) {
          res.send({error: 'PROJECT_EXISTS_WITH_SAME_TITLE' });
          return
        }

        const createdProject = createProject(req.body);
        if (!createdProject.error) {
          createMember(
            {
              'userid': req.query.userid, 
              'role': 'owner'
            },
            createdProject.project.id
          );
          if (req.body.members) {
            req.body.members.map((member) => {
              createMember(member, createdProject.project.id);
            })
          }
        }

        res.send(createdProject);
      }, 500);
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