const fs = require('fs');
const membersJSON = `${__dirname}/../data/members.json`;

exports.readMembers = function  (projectid) {
  return JSON.parse(fs.readFileSync(membersJSON, 'utf8'));
}

exports.readMembersWithProjectId = function  (projectid) {
  const members = JSON.parse(fs.readFileSync(membersJSON, 'utf8'));
  return members.filter(
    function(member) { 
      return (member.projectid === projectid)
    }
  );
}

function hasCorrectProps(member) {
  const roles = {
    critic: 'critic',
    owner: 'owner',
    animator: 'animator',
    producer: 'producer'
  }
  return (member.userid && roles[member.role]);
}

exports.createMember = function  (newMember, projectid) {
  if (!hasCorrectProps(newMember)) {
    return { error: 'INCORRECT_MEMBER_PROPERTY'}
  }
  
  const members = exports.readMembers();
  newMember.id = `new${Math.floor(Math.random()*1000000)}`;
  newMember.projectid = projectid;

  const existAlready = members.find(function (member){
    return ((member.userid===newMember.userid) &&
      (member.projectid===newMember.projectid))
  });

  if (existAlready) {
    return { error: 'MEMBER_EXISTS'}
  }
  members.push(newMember) 
  fs.writeFileSync(membersJSON, JSON.stringify(members, null, 2));
  return newMember;
}

exports.readMember = function  (shotid) {
  const shot = exports.readShots().find(function(shot) {
    return (shotid === shot.id);
  }); 
  
  return { 
    success: true,
    shot: shot
  }
}

exports.updateMember = function  ( memberData, project_id) {
  if (!hasCorrectProps(memberData)) {
    return { error: 'INCORRECT_MEMBER_PROPERTY'}
  }
 
  var recordedChange = false;
  const members = exports.readMembers().map(function(member) {
    if ((memberData.userid === member.userid) && (member.projectid === project_id)) {
      
      member = {
        ...member,
        ...memberData
      }

      recordedChange = true;
    }
    return member;
  }); 

  fs.writeFileSync(membersJSON, JSON.stringify(members, null, 2));
  return { 
    success: recordedChange
  }
}

exports.deleteMember = function  (userid, project_id) {
  var deletingMember = 'false'
  const members = exports.readMembers().filter(function(member) {
     if ( 
      !((member.userid === userid) && 
      (member.projectid === project_id))
    ) {
      return member;
    } else {
      deletingMember = 'true';
    }
  });
  
  fs.writeFileSync(membersJSON, JSON.stringify(members, null, 2));
  
  return { 
    success: deletingMember
  }
}
