const express = require('express');
const router = express.Router();
const {readFile, writeFile} = require('fs').promises;
const {join} = require("path");

const multer  = require('multer');
const getFile = multer();

router.post('/', getFile.none(), async (req, res) => {
    console.log(req.body)
    const projectDataJSON = await readFile(`./data/${req.body.projectId}/data.json`);
    const projectData = JSON.parse(projectDataJSON);
    let taskID;
    let updatedTaskList;
    if (req.body.mode === "create") {
        const teamTaskCount = projectData.taskList.length;
        if (teamTaskCount === 0) {
            taskId = 0
        } else {
            taskId = projectData.taskList[teamTaskCount - 1].taskId + 1;
        }

        projectData.taskList.push({
            taskId,
            taskName: req.body.taskName,
            taskDescription: req.body.taskDescription,
            taskDueDate: req.body.taskDueDate,
            taskFinished: false,
            taskFinishedDate: undefined,
            taskAssignees: [],
        });
        updatedTaskList = projectData.taskList;
    }

    if (req.body.mode === "edit") {
        taskId = parseInt(req.body.taskToEditId);
        const index = projectData.taskList.findIndex(task => task.taskId === taskId);
        projectData.taskList[index].taskName = req.body.taskName;
        projectData.taskList[index].taskDescription = req.body.taskDescription;
        projectData.taskList[index].taskDueDate = req.body.taskDueDate;
        projectData.taskList[index].taskFinished = req.body.taskFinished;
        projectData.taskList[index].taskFinishedDate = req.body.taskFinishedDate;
        projectData.taskList[index].taskAssignees = req.body.taskAssignees;
        updatedTaskList = projectData.taskList;
    }

    if (req.body.mode === "remove") {
        updatedTaskList = projectData.taskList.filter(task => task.taskId !== parseInt(req.body.taskToRemoveId))

    }

    projectData.taskList = updatedTaskList;
    console.log(updatedTaskList);
    console.log(projectData);

    await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));

    const response = JSON.stringify({
        success: true,
        message: "",
        updatedTaskList,
    })
    res.send(response)
});


module.exports = router;