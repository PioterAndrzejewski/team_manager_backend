const {readFile, writeFile} = require('fs').promises;

const readProjectData =async (projectId) => {
    const projectDataJSON = await readFile(`./data/${projectId}/data.json`);
    return JSON.parse(projectDataJSON);
}

const writeProjectData =async (projectId, projectData) => {
    await writeFile(`./data/${projectId}/data.json`, JSON.stringify(projectData));
}

const findMembersIndex = (projectData, memberId) => {
    return projectData.projectMembers.findIndex(member => member.memberId === parseInt(memberId))
}

const findTaskIndex = (taskList, taskId) => {
    return taskList.findIndex(task => task.taskId === parseInt(taskId));
}



module.exports = {readProjectData, writeProjectData, findMembersIndex, findTaskIndex}
