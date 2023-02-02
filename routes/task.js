const express = require('express');
const router = express.Router();
const {readFile, writeFile} = require('fs').promises;

const multer  = require('multer');
const getFile = multer();


const {readProjectData, writeProjectData, findMembersIndex, findTaskIndex} = require('../utils/projectData')


const generateNewTaskId = (taskList)=> {
    const teamTaskCount = taskList.length;
    if (teamTaskCount === 0) {
        return 0
    } else {
        return taskList[teamTaskCount - 1].taskId + 1;
    }
}
const pushNewTaskToList = (taskList, taskId, taskName, taskDescription, taskDueDate) => {
    let updatedTaskList = [...taskList];
    console.log('w funkcji:')
    console.log(taskList)
    console.log(updatedTaskList)
    updatedTaskList.push({
        taskId,
        taskName,
        taskDescription,
        taskDueDate,
        taskFinished: false,
        taskFinishedDate: undefined,
        taskAssignees: [],
    })
    return updatedTaskList;
}
const updateProjectDataWithNewTaskList = (projectData, updatedTaskList) => {
    const updatedProjectData = {...projectData};
    updatedProjectData.taskList = updatedTaskList;
    return updatedProjectData;
}
const updateProjectDataWithNewProjectMembers = (projectData, updatedProjectMembers) => {
    const updatedProjectData = {...projectData};
    updatedProjectData.projectMembe = updatedProjectMembers;
    return updatedProjectData;
}
const updateTask = (taskList, taskToEditIndex, newTaskName, newTaskDescription, newTaskDueDate, newTaskFinished, newTaskFinishedDate) => {
    const updatedTaskList = [...taskList];
    updatedTaskList[taskToEditIndex].taskName = newTaskName;
    updatedTaskList[taskToEditIndex].taskDescription = newTaskDescription;
    updatedTaskList[taskToEditIndex].taskDueDate = newTaskDueDate;
    if (newTaskFinished) {
        updatedTaskList[taskToEditIndex].taskFinished = newTaskFinished;
        updatedTaskList[taskToEditIndex].taskFinishedDate = newTaskFinishedDate;
    }
    return updatedTaskList;
}
const setTaskFinished = (taskList, taskToEditIndex, taskFinishedDate) => {
    const updatedTaskList = [...taskList];
    updatedTaskList[taskToEditIndex].taskFinished = true;
    updatedTaskList[taskToEditIndex].taskFinishedDate = taskFinishedDate;
    return updatedTaskList;
}
const setTaskUnfinished = (taskList, taskToEditIndex) => {
    const updatedTaskList = [...taskList];
    updatedTaskList[taskToEditIndex].taskFinished = false;
    updatedTaskList[taskToEditIndex].taskFinishedDate = undefined;
    return updatedTaskList;
}
const removeTaskFromList = (taskList, taskToEditId) => {
    return  taskList.filter(task => task.taskId !== parseInt(taskToEditId));
}
const removeTaskFromMembers = (projectMembers, taskToEditId) => {
    const updatedProjectMembers = projectMembers.map(member => {
        const updatedTasks = member.memberTasks.filter(taskId => taskId !== parseInt(taskToEditId));
        return {...member,
            memberTasks: updatedTasks};
    })
    return updatedProjectMembers;

}
const addAssigneeToTask = (taskList, taskToEditIndex, memberId) => {
    const updatedTaskList = [...taskList];
    updatedTaskList[taskToEditIndex].taskAssignees.push(memberId);
    return updatedTaskList;
}
const updateMemberWithNewTask = (projectMembers, membersIndex, taskToEditId) => {
    const updatedProjectMembers = [...projectMembers];
    updatedProjectMembers[membersIndex].memberTasks.push(taskToEditId);
    return updatedProjectMembers;
}
const removeAssigneeFromTask = (taskList, taskToEditIndex, assigneeToRemove) => {
    const updatedTaskList = [...taskList];
    updatedTaskAssignees = updatedTaskList[taskToEditIndex].taskAssignees.filter(assignee => assignee !== parseInt(assigneeToRemove));
    updatedTaskList[taskToEditIndex].taskAssignees = updatedTaskAssignees;
    return updatedTaskList;
};
const removeTaskFromMember = (projectMembers, taskToEditIndex, assigneeToRemove, membersIndex) => {
    const updatedMembers = [...projectMembers];
    updatedMembers[membersIndex].memberTasks = projectMembers[membersIndex].memberTasks.filter(task => task !== parseInt(taskToEditIndex));
    return updatedMembers;
};

router.post('/', getFile.none(), async (req, res) => {
    const {
        mode,
        projectId,
        taskToEditId,
        taskName,
        taskDescription,
        taskDueDate,
        taskFinished,
        taskFinishedDate,
        memberId,
        assigneeToRemove} = req.body;
    const projectData = await readProjectData(projectId);
    const {taskList, projectMembers} = projectData;
    console.log(req.body)

    if (mode === "create") {
        const newTaskId = generateNewTaskId(taskList)
        const updatedTaskList = pushNewTaskToList(taskList, newTaskId, taskName, taskDescription, taskDueDate);
        const updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        await writeProjectData(projectId, updatedProjectData)
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList,
        })
        res.send(response)
    }

    if (mode === "edit") {
        const taskToEditIndex = findTaskIndex(taskList, taskToEditId);
        const updatedTaskList = updateTask(taskList, taskToEditIndex, taskName, taskDescription, taskDueDate, taskFinished,taskFinishedDate);
        const updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        await writeProjectData(projectId, updatedProjectData)
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList,
        })
        res.send(response)
    }

    if (mode === "setfinished") {
        const taskToEditIndex = findTaskIndex(taskList, taskToEditId);
        const updatedTaskList = setTaskFinished(taskList, taskToEditIndex, taskFinishedDate);
        const updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        await writeProjectData(projectId, updatedProjectData)
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList,
        })
        res.send(response)
    }

    if (mode === "setunfinished") {
        const taskToEditIndex = findTaskIndex(taskList, taskToEditId);
        const updatedTaskList = setTaskUnfinished(taskList, taskToEditIndex);
        const updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        await writeProjectData(projectId, updatedProjectData)
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: projectData.taskList,
        })
        res.send(response)
    }

    if (mode === "remove") {
        const updatedTaskList = removeTaskFromList(taskList, taskToEditId)
        const updatedMembers = removeTaskFromMembers(projectMembers, taskToEditId);
        let updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        updatedProjectData = updateProjectDataWithNewProjectMembers(updatedProjectData, updatedMembers);
        await writeProjectData(projectId, updatedProjectData);
        response = JSON.stringify({
            success: true,
            message: "",
            updatedTaskList: updatedTaskList,
            projectMembers: updatedMembers,
        })
        res.send(response);
    }

    if (mode === "addassignee") {
        const taskToEditIndex = findTaskIndex(taskList, taskToEditId);
        const updatedTaskList = addAssigneeToTask(taskList, taskToEditIndex, memberId)
        const membersIndex = findMembersIndex(projectData, memberId)
        const updatedMembers = updateMemberWithNewTask(projectMembers, membersIndex, taskToEditId);
        let updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        updatedProjectData = updateProjectDataWithNewProjectMembers(updatedProjectData, updatedMembers);
        await writeProjectData(projectId, updatedProjectData)
        response = JSON.stringify({
            success: true,
            message: "",
            projectTasks: updatedTaskList,
            projectMembers: updatedMembers,
        })
        res.send(response);
    }

    if (mode === "removeassignee") {
        const taskToEditIndex = findTaskIndex(taskList, taskToEditId);
        const updatedTaskList = removeAssigneeFromTask(taskList, taskToEditIndex, assigneeToRemove);
        const membersIndex = findMembersIndex(projectData, assigneeToRemove)
        const updatedMembers = removeTaskFromMember(projectMembers, taskToEditIndex, assigneeToRemove, membersIndex)
        let updatedProjectData = updateProjectDataWithNewTaskList(projectData, updatedTaskList);
        updatedProjectData = updateProjectDataWithNewProjectMembers(updatedProjectData, updatedMembers);
        await writeProjectData(projectId, updatedProjectData)
        response = JSON.stringify({
            success: true,
            message: "",
            projectTasks: projectData.taskList,
            projectMembers: projectData.projectMembers,
        })
        res.send(response);
    }

});


module.exports = router;