const fs = require('fs');
const projectJSON = `${__dirname}/../data/projects.json`;
const memberJSON = `${__dirname}/../data/members.json`;
const sessionJSON = `${__dirname}/../data/sessions.json`;
const userJSON = `${__dirname}/../data/users.json`;
const shotsJSON = `${__dirname}/../data/shots.json`;

exports.readProjects = function  () {
  return JSON.parse(fs.readFileSync(projectJSON, 'utf8'));
}

exports.readMembers = function  () {
  return JSON.parse(fs.readFileSync(memberJSON, 'utf8'));
}

exports.readUsers = function  () {
  return JSON.parse(fs.readFileSync(userJSON, 'utf8'));
}

exports.readSessions = function  () {
  return JSON.parse(fs.readFileSync(sessionJSON, 'utf8'));
}

exports.readShots = function  () {
  return JSON.parse(fs.readFileSync(shotsJSON, 'utf8'));
}

exports.writeSessions = function  (sessions) {
  fs.writeFileSync(sessionJSON, JSON.stringify(sessions));
}

function hasCorrectProps(newproject) {
  const publishTypes = ['private', 'public'];
  
  return (newproject.title && newproject.description && publishTypes.includes(newproject.status));
}

exports.updateProject = function  ( newproject, projectid) {
  if (!hasCorrectProps(newproject)) {
    return { error: 'INCORRECT_PROJECT_PROPERTY'}
  }

  const projects = exports.readProjects()
    .map(function(project) {
      if (project.id === projectid) {
        newproject.id = project.id;
        return newproject;
      }
      return project;
    });
  
  fs.writeFileSync(projectJSON, JSON.stringify(projects, null, 2));
  return { success: true}
}

exports.createProject = function  ( newproject) {
  if (!hasCorrectProps(newproject)) {
    return { error: 'INCORRECT_PROJECT_PROPERTY'}
  }
  
  const projects = exports.readProjects();
  newproject.id = `new${Math.floor(Math.random()*1000000)}`
  projects.push(newproject)
  
  fs.writeFileSync(projectJSON, JSON.stringify(projects, null, 2));
  return { success: true,
    project: newproject
  }
}

exports.deleteProject = function (projectid) {
  const projects = exports.readProjects().filter(function(project) {
    return (project.id !== projectid);
  });

  fs.writeFileSync(projectJSON, JSON.stringify(projects, null, 2));
  return { success: true}
}

exports.createMember = function (projectid, userid, role) {
  const members = exports.readMembers();
  const newMember = { 
    projectid,
    userid,
    role
  }
  members.push(newMember);
  fs.writeFileSync(memberJSON, JSON.stringify(members, null, 2));
}