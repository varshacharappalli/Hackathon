const mongoose = require("mongoose");

const mongo_db = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/Resumedb", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database successfully connected.");
    } catch (err) {
        console.log("Database couldn't be connected successfully.");
        console.log(err.message);
    }
};

const ResumeSchema = new mongoose.Schema({
    filename: String,
    text: String,
    name: String,               
    phone: String,              
    email: String,              
    skills: [String],           
    experience: String,        
    achievements: [String]       
});

const Resume = mongoose.model("Resume", ResumeSchema);

module.exports = { mongo_db, Resume }; 