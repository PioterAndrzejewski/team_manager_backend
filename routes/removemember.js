const express = require('express');
const router = express.Router();
const {readFile, writeFile} = require('fs').promises;
const {join} = require("path");
const bodyParser = require('body-parser')

router.post('/', bodyParser.json(), async (req, res) => {
    console.log(req.body)
    const projectDataJSON = await readFile(`./data/${req.body.projectId}/data.json`);
    const projectData = JSON.parse(projectDataJSON);
    const teamMembers = projectData.projectMembers;
    const updatedMembers = teamMembers.filter(member => member.memberId !== parseInt(req.body.removeMemberId));

    projectData.projectMembers = updatedMembers;
    const projectTasks = projectData.taskList;
    const updatedProjectTasks = projectTasks.map(task => {
        task.taskAssignees = task.taskAssignees.filter(assignee => assignee !== parseInt(req.body.removeMemberId));
        return task;
    })


    console.log(req.body.removeMemberId);
    console.log(updatedProjectTasks);


    await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));
    const response = JSON.stringify({
        creationSuccess: true,
        projectMembers: updatedMembers,
    })
    res.send(response);
});

module.exports = router;