var express = require('express');
const {normalize, resolve} = require("path");
var router = express.Router();
const {readFile, writeFile,  mkdir, copyFile} = require('fs').promises;
const {safeJoin} = require('../utils/safeJoin');

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


    const projectsListDataFromFile = await readFile(PROJECTS_LIST_FILE, 'utf8');
    const projectsList = JSON.parse(projectsListDataFromFile);
    const lastProjectId = projectsList[projectsList.length-1].projectId;
    const newProjectId = lastProjectId + 1;

    projectsList.push({
      projectId: newProjectId, projectName: req.body.projectName});
    const newProjectsListJSON = JSON.stringify(projectsList);
    await writeFile(PROJECTS_LIST_FILE, newProjectsListJSON);

    const newProjectDatabase = {
        projectId: 0,
        projectName: "",
        projectMembers: [{
            memberId: 0,
            memberName: "Wacław",
            memberTasks: [0],
            memberIsLeader: true,
            memberImageURL: 'http://localhost:3636/getimage/9215/face_member_0.jpg'
        }, {
            memberId: 1,
            memberName: "Moniczka",
            memberTasks: [0, 1],
            memberIsLeader: false,
            memberImageURL: 'http://localhost:3636/getimage/9215/face_member_1.jpg'
        }],
        taskList: [{
            taskId: 0,
            taskName: "Test task",
            taskDueDate: new Date(),
            taskFinished: true,
            taskFinishedDate: true,
            taskAssignees: [0]
        }, {
            taskId: 1,
            taskName: "Test task 2",
            taskDueDate: new Date(),
            taskFinished: false,
            taskFinishedDate: undefined,
            taskAssignees: [0, 1]
        }],
    }

    newProjectDatabase.projectId = newProjectId;
    newProjectDatabase.projectName = req.body.projectName;
    newProjectDatabase.projectMembers[0].memberName = req.body.leaderName;

    const newProjectDatabaseJSON = JSON.stringify(newProjectDatabase);
    await mkdir(`./data/${newProjectId}`);
    await mkdir(`./data/${newProjectId}/img`);
    await copyFile('./data/template/img/face_member_0.jpg', `./data/${newProjectId}/img/face_member_0.jpg`);
    await copyFile('./data/template/img/face_member_1.jpg', `./data/${newProjectId}/img/face_member_1.jpg`);
    await writeFile(`./data/${newProjectId}/data.txt`, newProjectDatabaseJSON, {
        recursive: true,
    });

    const response = JSON.stringify({
      creationSuccess: true,
      projectId: newProjectId,
      projectName: req.body.projectName,
    })
  res.end(response)
});





module.exports = router;
