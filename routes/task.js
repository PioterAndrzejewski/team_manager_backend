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
    console.log(req.body)
    let taskID;
    let updatedTaskList;
    let response;


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
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
    }

    if (req.body.mode === "edit") {
        taskId = parseInt(req.body.taskToEditId);
        const index = projectData.taskList.findIndex(task => task.taskId === taskId);
        projectData.taskList[index].taskName = req.body.taskName;
        projectData.taskList[index].taskDescription = req.body.taskDescription;
        projectData.taskList[index].taskDueDate = req.body.taskDueDate;
        projectData.taskList[index].taskFinished = req.body.taskFinished === 'true';
        projectData.taskList[index].taskFinishedDate = req.body.taskFinishedDate[0];
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
    }


    if (req.body.mode === "setfinished") {
        taskId = parseInt(req.body.taskToEditId);
        const index = projectData.taskList.findIndex(task => task.taskId === taskId);
        projectData.taskList[index].taskFinished = true;
        projectData.taskList[index].taskFinishedDate = req.body.finishedDate;
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
    }

    if (req.body.mode === "setunfinished") {
        taskId = parseInt(req.body.taskToEditId);
        const index = projectData.taskList.findIndex(task => task.taskId === taskId);
        projectData.taskList[index].taskFinished = false;
        projectData.taskList[index].taskFinishedDate = undefined;
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
    }

    if (req.body.mode === "remove") {
        updatedTaskList = projectData.taskList.filter(task => task.taskId !== parseInt(req.body.taskToEditId));
        projectData.taskList = updatedTaskList;
        console.log(updatedTaskList);
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
    }

    if (req.body.mode === "addassignee") {
        projectData.taskList[req.body.taskId].taskAssignees.push(req.body.memberId);
        projectData.projectMembers[req.body.memberId].memberTasks.push(req.body.taskId);
        response = JSON.stringify({
            success: true,
            message: "",
            projectTasks: projectData.taskList,
            projectMembers: projectData.projectMembers,
        })
    }


    if (req.body.mode === "removeassignee") {
        updatedTaskAssignees = projectData.taskList[req.body.taskToEditId].taskAssignees.filter(assignee => assignee !== parseInt(req.body.assigneeToRemove));
        projectData.taskList[req.body.taskToEditId].taskAssignees = updatedTaskAssignees;

        updatedMemberTasks = projectData.projectMembers[req.body.assigneeToRemove].memberTasks.filter(task => task !== parseInt(req.body.taskToEditId));
        projectData.projectMembers[req.body.assigneeToRemove].memberTasks = updatedMemberTasks;

        console.log(projectData.projectMembers);
        console.log(projectData.taskList);


        response = JSON.stringify({
            success: true,
            message: "",
            projectTasks: projectData.taskList,
            projectMembers: projectData.projectMembers,
        })
    }


    await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));
    res.send(response)
});


module.exports = router;