const fs = require("fs");

module.exports = function(app, db) {

  /** CREATE IMAGES */
  app.post('/projects/:project_id/shots/:shot_id/images', (req, res) => {
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

    fs.writeFile(`${dataPath}/${req.body.name}.png`, binaryData, "binary", function (err) {
      console.log('err', err); // writes out file without error, but it's not a valid image
    });
    
    res.send(JSON.stringify({ success: true}));
  });

}