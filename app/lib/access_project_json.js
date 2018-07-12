const fs = require('fs');
const projectJSON = `${__dirname}/../data/projects.json`;
const sessionJSON = `${__dirname}/../data/sessions.json`;
const userJSON = `${__dirname}/../data/users.json`;

exports.readProjects = function  () {
  return JSON.parse(fs.readFileSync(projectJSON, 'utf8'));
}

exports.readUsers = function  () {
  return JSON.parse(fs.readFileSync(userJSON, 'utf8'));
}

exports.readSessions = function  () {
  return JSON.parse(fs.readFileSync(sessionJSON, 'utf8'));
}

exports.writeSessions = function  (sessions) {
  fs.writeFileSync(sessionJSON, JSON.stringify(sessions));
}

function hasCorrectProps(newproject) {
  const publishTypes = ['private', 'public'];
  
  return (newproject.title && newproject.description && publishTypes.includes(newproject.status));
}

function whitePropsProject (project) {
  return {
    title: project.title,
    description: project.description,
    status: project.status
  }
}

exports.createProject = function  ( bodyProject) {
  if (!hasCorrectProps(bodyProject)) {
    return { error: 'INCORRECT_PROJECT_PROPERTY'}
  }
  
  const projects = exports.readProjects();
  
  const newproject = whitePropsProject (bodyProject)
  newproject.id = `new${Math.floor(Math.random()*1000000)}`
  projects.push(newproject)
  
  
  fs.writeFileSync(projectJSON, JSON.stringify(projects, null, 2));
  return { success: true,
    project: newproject
  }
}

exports.updateProject = function  ( newproject, projectid) {
  if (!hasCorrectProps(newproject)) {
    return { error: 'INCORRECT_PROJECT_PROPERTY'}
  }

  const projects = exports.readProjects()
    .map(function(project) {
      if (project.id === projectid) {
        newproject.id = project.id;

        return {
          id: project.id,
          title: newproject.title,
          description: newproject.description,
          status: newproject.status
        };
      }
      return project;
    });
  
  fs.writeFileSync(projectJSON, JSON.stringify(projects, null, 2));
  return { success: true}
}


exports.deleteProject = function (projectid) {
  const projects = exports.readProjects().filter(function(project) {
    return (project.id !== projectid);
  });

  fs.writeFileSync(projectJSON, JSON.stringify(projects, null, 2));
  return { success: true}
}




