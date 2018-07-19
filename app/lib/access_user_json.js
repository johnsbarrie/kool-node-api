const fs = require('fs');
const usersJSON = `${__dirname}/../data/users.json`;

exports.readUsers = function  () {
  return JSON.parse(fs.readFileSync(usersJSON, 'utf8'));
}

function hasCorrectProps(user) {
  console.log('user', user)
  return (user.name && user.email && user.password);
}

exports.createUser = function  (newuser) {
  if (!hasCorrectProps(newuser)) {
    return { error: 'INCORRECT_SHOT_PROPERTY'}
  }
  
  const users = exports.readUsers();
  const userExists = users.find(function(user) {
    return ((user.name === newuser.name) || (user.email === newuser.email))
  });

  if (userExists) {
    return { error: 'USER_EXISTS'}
  }
  
  newuser.id = `user${Math.floor(Math.random()*1000000)}`

  users.push(newuser)
  fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
  return newuser;
}

exports.updateUser = function  (userid, loggedUserId, userData) {
  if (!hasCorrectProps(userData)) {
    return { error: 'INCORRECT_USER_PROPERTY'}
  }
 
  var recordedChange = false;
  const users = exports.readUsers().map(function(user) {

    if ((userid === user.id) && (loggedUserId === user.id)) {
      user = {
        ...user,
        ...userData
      }
      recordedChange = true;
    }
    return user;
  }); 

  fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
  return {
    success: recordedChange
  }
}

exports.deleteShot = function  (userid, project_id, shotid) {
  var deletingShot = 'false'
  const shots = exports.readShots().filter(function(shot) {
    if (
      !((shotid === shot.id) && 
      (shot.userid === userid) && 
      (shot.projectid === project_id))
    ) {
      return shot;
    } else {
      deletingShot = 'true';
    }
  });
  
  fs.writeFileSync(shotsJSON, JSON.stringify(shots, null, 2));
    
  return { 
    success: deletingShot
  }
}
