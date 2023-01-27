const express = require('express');
const router = express.Router();
const {readFile, writeFile} = require('fs').promises;
const {join} = require("path");
const multer  = require('multer');
const upload = multer();

router.post('/', upload.single('avatar'), async (req, res) => {
    const projectDataJSON = await readFile(`./data/${req.body.projectId}/data.json`);
    const projectData = JSON.parse(projectDataJSON)
    const teamMembersCount = projectData.projectMembers.length;
    const newMemberId = projectData.projectMembers[teamMembersCount - 1].memberId + 1;
    projectData.projectMembers.push({
        memberId: newMemberId,
        memberName: req.body.newMemberName,
        memberTasks: [],
        memberIsLeader: false,
        memberImageURL: `http://localhost:3636/getimage/${projectData.projectId}/face_member_${newMemberId}.${req.body.fileExtension}`,
    });

    await writeFile(`./data/${projectData.projectId}/img/face_member_${newMemberId}.${req.body.fileExtension}`, req.file.buffer)


    await writeFile(`./data/${projectData.projectId}/data.json`, JSON.stringify(projectData));

    const response = JSON.stringify({
        creationSuccess: true,
        projectMembers: projectData.projectMembers,
    })
    res.send(response)
});


module.exports = router;
