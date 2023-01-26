const express = require('express');
const router = express.Router();
const {readFile, writeFile,  mkdir, copyFile} = require('fs').promises;

const PROJECTS_LIST_FILE = './data/projectsList.txt'

const checkIfNewProjectDataIsValid = (req, res) => {
  if (req.body.projectName.length < 3 ) {
    return {valid: false, message: "Project name too short"};
  }
  if (req.body.leaderName.length < 3) {
    return {valid: false, message: "Project leader name too short"};
  }

  return {valid: true, message: ""};
}
const setupNewProjectDirectory = async (req)=> {
    const projectsListDataFromFile = await readFile(PROJECTS_LIST_FILE, 'utf8');
    const projectsList = JSON.parse(projectsListDataFromFile);
    const lastProjectId = projectsList[projectsList.length-1].projectId;
    const newProjectId = lastProjectId + 1;

    projectsList.push({
        projectId: newProjectId, projectName: req.projectName});
    const newProjectsListJSON = JSON.stringify(projectsList);
    await writeFile(PROJECTS_LIST_FILE, newProjectsListJSON);

    await mkdir(`./data/${newProjectId}`);
    await mkdir(`./data/${newProjectId}/img`);
    await copyFile('./data/template/img/face_member_0.jpg', `./data/${newProjectId}/img/face_member_0.jpg`);
    await copyFile('./data/template/img/face_member_1.jpg', `./data/${newProjectId}/img/face_member_1.jpg`);
    await copyFile('./data/template/data.txt', `./data/${newProjectId}/data.txt`);

    const projectDatabaseTemplate = await readFile(`./data/template/data.txt`);
    const newProjectDatabase = JSON.parse(projectDatabaseTemplate);
    newProjectDatabase.projectId = newProjectId;
    newProjectDatabase.projectName = req.projectName;
    newProjectDatabase.projectMembers[0].memberName = req.leaderName;
    const newProjectDatabaseJSON = JSON.stringify(newProjectDatabase);
    await writeFile(`./data/${newProjectId}/data.txt`, newProjectDatabaseJSON, {
        recursive: true,
    });

    return newProjectId;
}

router.post('/', async (req, res) => {
    let reqIsValid =  checkIfNewProjectDataIsValid(req, res);
    if (!reqIsValid.valid) {
      const response = JSON.stringify({
        creationSuccess: false,
        redirect: "/createProject",
        message: reqIsValid.message,
        projectId: null,
      });
      res.end(response)
      return;
    }

    const newProjectId = await setupNewProjectDirectory(req.body);

    const response = JSON.stringify({
      creationSuccess: true,
      projectId: newProjectId,
      projectName: req.body.projectName,
    })
  res.end(response)
});


module.exports = router;
