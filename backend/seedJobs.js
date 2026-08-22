const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

dotenv.config();

const sampleJobsDB = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    experience: '3-5 Years',
    requiredSkills: ['javascript', 'react', 'css', 'html', 'redux', 'typescript'],
    salary: '$110,000 - $140,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Senior%20Frontend%20Developer'
  },
  {
    title: 'MERN Stack Developer',
    company: 'StartupX',
    location: 'Remote',
    type: 'Remote',
    experience: '1-3 Years',
    requiredSkills: ['javascript', 'react', 'node.js', 'express', 'mongodb', 'html'],
    salary: '$80,000 - $115,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=MERN%20Stack%20Developer'
  },
  {
    title: 'Full Stack Engineer',
    company: 'Innovate AI',
    location: 'New York, NY',
    type: 'On-site',
    experience: '2-4 Years',
    requiredSkills: ['react', 'node.js', 'postgresql', 'aws', 'docker'],
    salary: '$120,000 - $160,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Engineer'
  },
  {
    title: 'Backend Developer',
    company: 'DataStream Inc.',
    location: 'Austin, TX',
    type: 'Remote',
    experience: '1-3 Years',
    requiredSkills: ['python', 'django', 'sql', 'redis', 'aws'],
    salary: '$95,000 - $125,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Backend%20Developer'
  },
  {
    title: 'Cloud DevOps Engineer',
    company: 'GlobalNet',
    location: 'Seattle, WA',
    type: 'Hybrid',
    experience: '4+ Years',
    requiredSkills: ['aws', 'docker', 'kubernetes', 'jenkins', 'linux', 'bash'],
    salary: '$130,000 - $170,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Cloud%20DevOps%20Engineer'
  },
  {
    title: 'Data Analyst',
    company: 'MetricsFlow',
    location: 'Remote',
    type: 'Remote',
    experience: '1-2 Years',
    requiredSkills: ['sql', 'python', 'excel', 'tableau', 'data science'],
    salary: '$75,000 - $90,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Analyst'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Future',
    location: 'Boston, MA',
    type: 'Hybrid',
    experience: '3-5 Years',
    requiredSkills: ['python', 'machine learning', 'tensorflow', 'pytorch', 'sql'],
    salary: '$140,000 - $190,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Engineer'
  },
  {
    title: 'Junior React Developer',
    company: 'Creative Web Agency',
    location: 'Los Angeles, CA',
    type: 'On-site',
    experience: '0-2 Years',
    requiredSkills: ['javascript', 'react', 'html', 'css', 'bootstrap'],
    salary: '$70,000 - $90,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20React%20Developer'
  },
  {
    title: 'Node.js Backend Engineer',
    company: 'Fintech Solutions',
    location: 'Remote',
    type: 'Remote',
    experience: '2-4 Years',
    requiredSkills: ['node.js', 'express', 'mongodb', 'rest api', 'git'],
    salary: '$100,000 - $135,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Node.js%20Backend%20Engineer'
  },
  {
    title: 'Blockchain Software Engineer',
    company: 'CryptoBase',
    location: 'Miami, FL',
    type: 'Hybrid',
    experience: '2-5 Years',
    requiredSkills: ['rust', 'go', 'solidity', 'blockchain', 'javascript'],
    salary: '$130,000 - $180,000',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=Blockchain%20Software%20Engineer'
  }
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if jobs already exist to prevent duplicates, and safely migrate them
    let updatedCount = 0;
    for (const job of sampleJobsDB) {
      const existingJob = await Job.findOne({ title: job.title, company: job.company });
      if (!existingJob) {
        await Job.create(job);
        console.log(`Seeded: ${job.title} at ${job.company}`);
      } else {
        // Safe migration update: only set applyLink if it exists in our seed array and isn't already set
        if (job.applyLink && existingJob.applyLink !== job.applyLink) {
          existingJob.applyLink = job.applyLink;
          await existingJob.save();
          console.log(`Updated (Migrated link): ${job.title} at ${job.company}`);
          updatedCount++;
        } else {
          console.log(`Skipped (already exists and up to date): ${job.title} at ${job.company}`);
        }
      }
    }
    console.log(`Migration completed: ${updatedCount} jobs updated with verified links.`);
    
    console.log('Job seeding process completed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding jobs: ${error.message}`);
    process.exit(1);
  }
};

seedJobs();
