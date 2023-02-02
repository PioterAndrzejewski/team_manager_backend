const express = require('express');
const router = express.Router();
const {readFile, writeFile,  mkdir, copyFile} = require('fs').promises;
const {readProjectsList, writeProjectsList} = require('../utils/projectsList')

const checkIfNewProjectDataIsValid = (req) => {
  if (req.body.projectName.length < 3 ) {
    return {isOk: false, message: "Project name too short"};
  }
  if (req.body.leaderName.length < 3) {
    return {isOk: false, message: "Project leader name too short"};
  }

  return {isOk: true, message: ""};
}
const sendResponseOK = (req, res, newProjectId) => {
    const response = JSON.stringify({
        creationSuccess: true,
        projectId: newProjectId,
        projectName: req.body.projectName,
    })
    res.end(response)
}
const sendResponseNotOk = (req, res, message) => {
    const response = JSON.stringify({
        creationSuccess: false,
        redirect: "/createProject",
        message: message,
        projectId: null,
    });
    res.end(response)
}
const pushNewProjectToList = async (projectName) => {
    const projectsList = await readProjectsList();
    const lastProjectId = projectsList[projectsList.length-1].projectId;
    const newProjectId = lastProjectId + 1;
    projectsList.push({
        projectId: newProjectId, projectName});
    writeProjectsList(projectsList)
    return newProjectId;
}
const setupNewProjectDirectory = async (req, newProjectId)=> {

    await mkdir(`./data/${newProjectId}`);
    await mkdir(`./data/${newProjectId}/img`);
    await copyFile('./data/template/img/face_member_0.jpg', `./data/${newProjectId}/img/face_member_0.jpg`);
    await copyFile('./data/template/data.json', `./data/${newProjectId}/data.json`);

    const projectDatabaseTemplate = await readFile(`./data/template/data.json`);
    const newProjectDatabase = JSON.parse(projectDatabaseTemplate);
    newProjectDatabase.projectId = newProjectId;
    newProjectDatabase.projectName = req.projectName;
    newProjectDatabase.projectMembers[0].memberName = req.leaderName;
    newProjectDatabase.projectMembers[0].memberImageURL = `http://localhost:3636/getimage/${newProjectId}/face_member_0.jpg`;

    const newProjectDatabaseJSON = JSON.stringify(newProjectDatabase);
    await writeFile(`./data/${newProjectId}/data.json`, newProjectDatabaseJSON, {
        recursive: true,
    });
}

router.post('/', async (req, res) => {
    const validationResult =  checkIfNewProjectDataIsValid(req, res);
    if (!validationResult.isOk) {
        sendResponseNotOk(req, res, validationResult.message)
        return;
    }
    const newProjectId = await pushNewProjectToList(req.body.projectName);
    await setupNewProjectDirectory(req.body, newProjectId);
    sendResponseOK(req, res, newProjectId);
});

module.exports = router;