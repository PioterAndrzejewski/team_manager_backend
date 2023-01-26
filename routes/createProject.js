var express = require('express');
var router = express.Router();

const {readFile, writeFile} = require('fs').promises;

router.post('/', function(req, res, next) {
  console.log(req.body);
    if (req.body.projectName.length < 3 || req.body.leaderName.length < 3) {
      const response = JSON.stringify({
        creationSuccess: false,
        redirect: "/createProject",
        message: "Name length must be at least 3 characters",
        projectId: null,
      });
      res.end(response);
      return;
    }
    const response = JSON.stringify({
      creationSuccess: true,
      projectId: "555",
      projectName: req.body.projectName,
    })
  res.end(response)
});

router.get('/createdatabase', async (req, res) => {
  const projects = [
    {
      projectId: "0",
      projectName: "Test Project"
    }
  ];

  const promise = await writeFile('./data/projectsList.txt', JSON.stringify(projects), )
})

module.exports = router;
