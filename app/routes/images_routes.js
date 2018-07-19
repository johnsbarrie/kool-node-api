const fs = require("fs");
const { rightsForProject } = require('../lib/session');
const loggedIn = require('../lib/session').loggedIn;

function hasCorrectProps(newshot) {
  return (newshot.name && newshot.base64);
}

module.exports = function(app, db) {

  /** CREATE IMAGES */
  app.post('/projects/:project_id/shots/:shot_id/images', (req, res) => {
    if(!hasCorrectProps(req.body)) {
      res.send({error: 'INCORRECT_PROPERTY' });
      return;
    }

    const rights = rightsForProject(req);
    if(rights.canCreateShots && loggedIn(req.query)) {
      var dataPath = `${__dirname}/../data/images`;
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
      }

      dataPath = `${dataPath}/${req.params.project_id}.${req.params.shot_id}`

      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
      }

      var base64Data = req.body.base64;
      var binaryData;
      base64Data  =   base64Data.replace(/^data:image\/png;base64,/, "");
      base64Data  +=  base64Data.replace('+', ' ');
      binaryData  =   new Buffer(base64Data, 'base64');

      const imagepath = `${dataPath}/${req.body.name}.png`;
      if (fs.existsSync(imagepath)) {
        res.send(JSON.stringify({ error: 'IMAGE_EXISTS'}));  
      } else {
        fs.writeFile(imagepath, binaryData, "binary", function (err) {
          if (err) {
            res.send(JSON.stringify({ success: false}));  
          } else {
            res.send(JSON.stringify({ success: true}));
          }
        });
      }
    
    } else {
      res.send(JSON.stringify({ error: 'ACCESS_DENIED'}));  
    }

  });

}