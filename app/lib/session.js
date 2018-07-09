const fs = require('fs');
const readSessions = require("./access_project_json").readSessions;
const readMembers = require("./access_project_json").readMembers;
const readUsers = require("./access_project_json").readUsers;

exports.loggedIn = function (query) {
  const users = readSessions();
  const session = users.find(function (user) {
    return ((user.userid === query.userid) && 
      (user.jwt === query.jwt))
  });
  
  return (!!session)
}

exports.memberOfProject = function (userid, projectid) {
  const member = readMembers().find(function (member) {
    return ((member.projectid === projectid) && 
      (member.userid === userid))
  });
  return member;
}

exports.allMembersOfProject = function (projectid) {
  const members = readMembers().filter(function (member) {
    return (member.projectid === projectid)
  });
  return members;
}

exports.userWithID = function (userID) {
  const user = readUsers().find(function (user) {
    return (user.id === userID)
  });
  return user;
}

function canReadProject(member, projectstatus) {
  return ((projectstatus === 'public') 
  || (!!member && (member.role === 'critic' || member.role === 'owner' || member.role === 'animator')));
}

function canEditProject (member) {
  return ((!!member) && (member.role==='owner'));
}

function canCreateShots (member) {
  return ((!!member) && (member.role=='owner' || member.role=='animator'));
}

exports.projectRights = function (member, projectstatus) {
  const projectRights = {
    'canReadProject': canReadProject(member, projectstatus),
    'canEditProject': canEditProject(member),
    'canCreateShots': canCreateShots(member),
  };
  
  return projectRights;
}
