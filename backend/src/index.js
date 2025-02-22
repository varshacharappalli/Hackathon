const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");
const { mongo_db, Resume } = require("../src/db/db");
const {extractName,extractEmail,extractPhone,extractExperience,extractAchievements,extractSkills}=require('../src/utils')

const app=express();

const upload=multer({dest:"uploads/"});

app.use(cors());

app.use(express.json());

mongo_db();

app.post('/upload',upload.single("file"),async(req,res)=>{
    try {
        console.log(req.file);
        if(!req.file){
            return res.status(400).json({message:'No file uploaded'});
        }
        const filePath=req.file.path;
        const pdfBuffer=fs.readFileSync(filePath);

        const pdfData=await pdfParse(pdfBuffer);
        const parsedText = pdfData.text;
        
        const extractedData = {
            name: extractName(parsedText),
            phone: extractPhone(parsedText),
            email: extractEmail(parsedText),
            skills: extractSkills(parsedText),
            experience: extractExperience(parsedText),
            achievements: extractAchievements(parsedText)
        };
        
        const newResume = new Resume({
            text: parsedText,
            name: extractedData.name,
            phone: extractedData.phone,
            email: extractedData.email,
            skills: extractedData.skills,
            experience: extractedData.experience,
            achievements: extractedData.achievements
        });

        await newResume.save();

        res.status(200).json(extractedData);
        fs.unlinkSync(filePath);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Couldnt upload the file'});
    }
});

const PORT=process.env.PORT||5001;

app.listen(PORT,()=>{
    try{
        console.log('Running successfully on the port:'+PORT)
    }
    catch(error){
        console.log(error.message);
    }
});
