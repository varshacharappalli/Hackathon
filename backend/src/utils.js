export const extractName=(text)=>{
    const lines = text.split("\n").map(line => line.trim());
    for (let line of lines) {
        if (/^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/.test(line)) {
            return line;
        }
    }
    return "Not Found";
}

export const extractEmail=(text)=>{
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : "Not Found";
}

export const extractPhone=(text)=>{
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/;
    const match = text.match(phoneRegex);
    return match ? match[0] : "Not Found";
}

export const extractExperience=(text)=>{
    const experienceRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*experience)?/i;
    const match = text.match(experienceRegex);
    return match ? match[0] : "Not Found";
}

const skillsList = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", "SQL",
    "Machine Learning", "Data Science", "Django", "Flask", "TensorFlow",
    "HTML", "CSS", "Bootstrap", "AWS", "Docker", "Kubernetes"
];

export const extractSkills=(text)=>{
    const words = text.toLowerCase().split(/\W+/);
    return skillsList.filter(skill => words.includes(skill.toLowerCase()));
}

const achievementKeywords = ["awarded", "certified", "recognized", "promoted", "patent", "published", "granted"];

export const extractAchievements=(text)=>{
    const lines = text.split("\n");
    return lines.filter(line => achievementKeywords.some(keyword => line.toLowerCase().includes(keyword)));
}
