const fs = require('fs');
const shotsJSON = `${__dirname}/../data/shots.json`;


function hasCorrectProps(newtimeline) {
  return (newtimeline.images);
}

exports.readTimeline = function  (project_id, shot_id) {
  try {
    const json_path = `${__dirname}/../data/timelines/${project_id}.${shot_id}.json`;
    return JSON.parse(fs.readFileSync(
      json_path,
      'utf8'));
      
    
  } catch(e) {
    return { success:false}
  }
}

exports.updateTimeline = function  (timelineData, project_id, shot_id) {
  if (!hasCorrectProps(timelineData)) {
    return { error: 'INCORRECT_TIMELINE_PROPERTY'}
  }
  
  fs.writeFileSync(`${__dirname}/../data/timelines/${project_id}.${shot_id}.json`,
  JSON.stringify(timelineData, null, 2));
  return { 
    success: true
  }
}
