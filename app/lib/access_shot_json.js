const fs = require('fs');
const shotsJSON = `${__dirname}/../data/shots.json`;

exports.readShots = function  () {
  return JSON.parse(fs.readFileSync(shotsJSON, 'utf8'));
}

function hasCorrectProps(newshot) {
  return (newshot.title && newshot.description);
}

exports.createShot = function  (newshot, projectid, userid) {
  if (!hasCorrectProps(newshot)) {
    return { error: 'INCORRECT_SHOT_PROPERTY'}
  }
  
  const shots = exports.readShots();
  newshot.id = `new${Math.floor(Math.random()*1000000)}`
  newshot.status = 'IN_PROGRESS'
  newshot.projectid = projectid
  newshot.userid = userid

  shots.push(newshot)
  fs.writeFileSync(shotsJSON, JSON.stringify(shots, null, 2));
  return newshot;
}

exports.readShot = function  (shotid) {
  const shot = exports.readShots().find(function(shot) {
    return (shotid === shot.id);
  }); 
  
  return { 
    success: true,
    shot: shot
  }
}

exports.updateShot = function  (userid, shotData, project_id, shotid) {
  if (!hasCorrectProps(shotData)) {
    return { error: 'INCORRECT_SHOT_PROPERTY'}
  }
 
  var recordedChange = false;
  const shots = exports.readShots().map(function(shot) {
    if ((shotid === shot.id) && (shot.userid === userid)) {
      
      shot = {
        ...shot,
        ...shotData
      }
      recordedChange = true;
    }
    return shot;
  }); 

  fs.writeFileSync(shotsJSON, JSON.stringify(shots, null, 2));
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
  const error = (deletingShot==='true') ? null : 'SHOT_NOT_FOUND';
  return { 
    success: deletingShot,
    error: error
  }
}
