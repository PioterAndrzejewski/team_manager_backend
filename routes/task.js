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
        const taskIndex = projectData.taskList.findIndex(task => task.taskId === taskId);
        projectData.taskList[taskIndex].taskFinished = false;
        projectData.taskList[taskIndex].taskFinishedDate = undefined;
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
    }

    if (req.body.mode === "remove") {
        updatedTaskList = projectData.taskList.filter(task => task.taskId !== parseInt(req.body.taskToEditId));
        projectData.taskList = updatedTaskList;
        const updatedMembers = projectData.projectMembers.map(member => {
            const updatedTasks = member.memberTasks.filter(taskId => taskId != parseInt(req.body.taskToEditId));
            const updatedMember = {...member,
            memberTasks: updatedTasks};
            return updatedMember;
        })
        console.log(updatedTaskList);
        console.log(updatedMembers);
        projectData.projectMembers = updatedMembers;
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
            projectMembers: projectData.projectMembers,
        })
    }

    if (req.body.mode === "addassignee") {
        const taskIndex = projectData.taskList.findIndex(task => task.taskId === parseInt(req.body.taskToEditId));
        projectData.taskList[taskIndex].taskAssignees.push(req.body.memberId);
        const memberIndex = projectData.projectMembers.findIndex(member => member.memberId === parseInt(req.body.memberId));
        projectData.projectMembers[memberIndex].memberTasks.push(req.body.taskToEditId);
        response = JSON.stringify({
            success: true,
            message: "",
            projectTasks: projectData.taskList,
            projectMembers: projectData.projectMembers,
        })
    }


    if (req.body.mode === "removeassignee") {
        const taskIndex = projectData.taskList.findIndex(task => task.taskId === parseInt(req.body.taskToEditId));
        updatedTaskAssignees = projectData.taskList[taskIndex].taskAssignees.filter(assignee => assignee !== parseInt(req.body.assigneeToRemove));
        projectData.taskList[taskIndex].taskAssignees = updatedTaskAssignees;

        const memberIndex = projectData.projectMembers.findIndex(member => member.memberId === parseInt(req.body.assigneeToRemove));
        updatedMemberTasks = projectData.projectMembers[memberIndex].memberTasks.filter(task => task !== parseInt(req.body.taskToEditId));
        projectData.projectMembers[memberIndex].memberTasks = updatedMemberTasks;

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