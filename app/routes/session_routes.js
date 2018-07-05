
const fs = require('fs');
const sessionJSON = `${__dirname}/../data/sessions.json`;
const userJSON = `${__dirname}/../data/users.json`;

function readUsers () {
  return JSON.parse(fs.readFileSync(userJSON, 'utf8'));
}

function readSessions () {
  return JSON.parse(fs.readFileSync(sessionJSON, 'utf8'));
}

function writeSessions (sessions) {
  fs.writeFileSync(sessionJSON, JSON.stringify(sessions));
}

module.exports = function(app, db) {
  app.post('/signin', (req, res) => {
    const request = req.body
    console.log('request', req.body)
    const user = readUsers().find(function (u) {
      return u.user === request.user && u.password === request.password
    });
    
    if (user) {
      const session = { userid: user.id, jwt: `${user.id}_fakejwt` }
      const sessions = readSessions();
      sessions.push(session)
      writeSessions(sessions);
      res.send(JSON.stringify(session));
    } else {
      res.send(JSON.stringify({
        error: "LOGIN_ERROR"
      }));
    }
  });

  app.post('/signout', (req, res) => {
    const openSessions = readSessions().filter(session => {
      return (
        (session.userid !== req.body.userid)
        && (session.jwt !== req.body.jwt)
      )
    });
    writeSessions(openSessions);

    res.send(JSON.stringify({
      message: "SIGNED_OUT",
      error: null
    }));
  });

}