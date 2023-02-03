const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {readProjectData, writeProjectData} = require('../utils/projectData')

const removeMember = (projectMembers, removeMemberId) => {
    return projectMembers.filter(member => member.memberId !== parseInt(removeMemberId));
}
const removeMemberFromTasks = (projectTasks, removeMemberId) => {
    console.log(projectTasks);
    return projectTasks.map(task => {
        task.taskAssignees = task.taskAssignees.filter(assignee => assignee !== parseInt(removeMemberId));
        return task;
    });
}
const updateProjectData = (projectData, updatedMembers, updatedTasks) => {
    const updatedProjectData = {...projectData};
    updatedProjectData.projectMembers = updatedMembers;
    updatedProjectData.taskList = updatedTasks;
    return updatedProjectData;
}


router.post('/', bodyParser.json(), async (req, res) => {
    const {projectId, removeMemberId} = req.body;
    const projectData = await readProjectData(projectId);
    const {projectMembers, taskList} = projectData;
    const updatedMembers = removeMember(projectMembers, removeMemberId);
    const updatedTasks = removeMemberFromTasks(taskList, removeMemberId)
    const updatedProjectData = updateProjectData(projectData, updatedMembers, updatedTasks)
    await writeProjectData(projectId,updatedProjectData);

    const response = JSON.stringify({
        creationSuccess: true,
        projectMembers: updatedMembers,
        projectTasks: updatedTasks,
    })
    res.send(response);
});


module.exports = router;

