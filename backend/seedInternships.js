const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Internship = require('./models/Internship');

dotenv.config({ path: path.join(__dirname, '.env') });

const internshipsData = [
  {
    title: "Software Engineering Intern",
    company: "Sixtyfour (YC)",
    companyWebsite: "https://www.ycombinator.com/companies/sixtyfour",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "Competitive (Paid)",
    duration: "6 months",
    requirements: ["C++", "Python", "Algorithms", "Software Engineering"],
    description: "Join our core engineering team to build scalable applications. As an early intern at a fast-growing startup, you will work directly with the founders to build foundational software.",
    responsibilities: [
      "Write clean, maintainable code",
      "Participate in design and code reviews",
      "Collaborate to define, design, and ship new features"
    ],
    eligibility: [
      "Pursuing a degree in Computer Science or related field",
      "Strong coding foundation"
    ],
    benefits: [
      "Competitive stipend",
      "Mentorship from founders",
      "High growth environment"
    ],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.ycombinator.com/companies/sixtyfour/jobs/39SkSrA-software-engineering-intern"
  },
  {
    title: "Machine Learning (ML) Engineer Intern",
    company: "Peakflo (YC)",
    companyWebsite: "https://www.peakflo.co",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "Paid",
    duration: "3-6 months",
    requirements: ["Python", "Machine Learning", "Data Science", "SQL"],
    description: "Peakflo is building the finance operations OS. We are looking for an ML intern to help build predictive models and analyze large datasets to automate finance workflows.",
    responsibilities: [
      "Develop and train predictive ML models",
      "Process and clean large financial datasets",
      "Deploy models to cloud infrastructure"
    ],
    eligibility: [
      "Experience with Python and ML libraries (scikit-learn, TensorFlow, etc.)",
      "Strong background in statistics and data analysis"
    ],
    benefits: [
      "Remote work culture",
      "Real-world fintech experience",
      "Potential for full-time conversion"
    ],
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.ycombinator.com/companies/peakflo/jobs/I4Ehwpd-machine-learning-ml-engineer-intern-paid-india-remote"
  },
  {
    title: "Software Engineering Intern (AI Native)",
    company: "FrontPage (YC)",
    companyWebsite: "https://www.ycombinator.com/companies/frontpage",
    location: "Bengaluru, Karnataka",
    type: "On-site",
    paid: true,
    stipend: "Paid",
    duration: "6 months",
    requirements: ["Python", "TypeScript", "LLMs", "React"],
    description: "Build AI-native products from the ground up in our Bengaluru office. You will integrate modern language models into scalable product architectures.",
    responsibilities: [
      "Develop full-stack features using React and TypeScript",
      "Integrate and optimize LLM calls",
      "Collaborate in a fast-paced on-site environment"
    ],
    eligibility: [
      "Strong proficiency in modern web frameworks",
      "Passion for AI and generative models"
    ],
    benefits: [
      "On-site collaborative environment in Bengaluru",
      "Cutting-edge AI exposure",
      "High impact role"
    ],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.ycombinator.com/companies/frontpage/jobs/i7yAbdy-software-engineering-intern-ai-native-product-engineering"
  },
  {
    title: "Growth & Marketing Intern",
    company: "SuperKalam (YC)",
    companyWebsite: "https://superkalam.com",
    location: "Bengaluru, Karnataka",
    type: "Hybrid",
    paid: true,
    stipend: "Paid (PPO opportunity)",
    duration: "6 months",
    requirements: ["Marketing", "Growth Hacking", "Social Media", "Analytics"],
    description: "Help scale our edtech platform. This is a high-impact internship focusing on user acquisition, engagement, and retention strategies.",
    responsibilities: [
      "Execute digital marketing campaigns",
      "Analyze growth metrics and optimize funnels",
      "Manage social media presence and community"
    ],
    eligibility: [
      "Creative thinker with an analytical mindset",
      "Understanding of digital marketing channels"
    ],
    benefits: [
      "Direct path to Pre-Placement Offer (PPO)",
      "Hybrid work in Bengaluru",
      "Mentorship from growth leaders"
    ],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.ycombinator.com/companies/superkalam/jobs/2ue7xrO-growth-marketing-internship-to-ppo-bangalore"
  },
  {
    title: "Design Intern",
    company: "Deep24 (YC)",
    companyWebsite: "https://www.ycombinator.com/companies/deep24",
    location: "Remote",
    type: "Remote",
    paid: true,
    stipend: "Paid",
    duration: "3 months",
    requirements: ["Figma", "UI/UX Design", "Wireframing", "Prototyping"],
    description: "Craft beautiful and intuitive user interfaces. You will work on solving complex UX challenges and bringing concepts to life visually.",
    responsibilities: [
      "Create wireframes, mockups, and prototypes",
      "Conduct user research and usability testing",
      "Maintain and expand the design system"
    ],
    eligibility: [
      "Strong portfolio showcasing UI/UX skills",
      "Proficiency in Figma or similar design tools"
    ],
    benefits: [
      "Creative freedom and ownership",
      "Remote work environment",
      "Work directly with product teams"
    ],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.ycombinator.com/companies/deep24/jobs/HeHnv5v-design-intern"
  },
  {
    title: "Business Development Intern",
    company: "Peakflo (YC)",
    companyWebsite: "https://www.peakflo.co",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "Paid",
    duration: "6 months",
    requirements: ["Sales", "B2B", "Communication", "CRM"],
    description: "Learn the ropes of B2B SaaS sales. You will identify prospects, initiate outreach, and help close deals in the fast-paced fintech industry.",
    responsibilities: [
      "Conduct market research to identify potential leads",
      "Assist in outreach campaigns and follow-ups",
      "Maintain and update CRM databases"
    ],
    eligibility: [
      "Strong interpersonal and communication skills",
      "Eagerness to learn B2B sales processes"
    ],
    benefits: [
      "Comprehensive sales training",
      "Remote work culture",
      "Incentive opportunities based on performance"
    ],
    postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.ycombinator.com/companies/peakflo/jobs/f5KL6FY-business-development-intern-paid-india-remote"
  },
  {
    title: "Outreachy Open Source Internship",
    company: "Outreachy",
    companyWebsite: "https://www.outreachy.org",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "$7,000 USD total",
    duration: "3 months",
    requirements: ["Open Source", "Software Development", "Documentation", "Git"],
    description: "Outreachy provides internships in open source and open science. Interns work remotely with mentors from open source communities.",
    responsibilities: [
      "Contribute code or design to open source projects",
      "Collaborate publicly on issue trackers",
      "Write bi-weekly progress blogs"
    ],
    eligibility: [
      "Open to applicants globally who face under-representation in tech",
      "Must be available full-time during the internship period"
    ],
    benefits: [
      "$7,000 USD stipend",
      "Dedicated community mentorship",
      "Permanent publicly verifiable contributions"
    ],
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    applyLink: "https://www.outreachy.org/apply/"
  },
  {
    title: "Google Summer of Code Contributor",
    company: "Google / Open Source",
    companyWebsite: "https://opensource.google",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "$1,500 - $3,000 USD",
    duration: "12-22 weeks",
    requirements: ["Open Source", "C++", "Python", "JavaScript", "Mentorship"],
    description: "Google Summer of Code is a global, online program focused on bringing new contributors into open source software development.",
    responsibilities: [
      "Write code for an open source project",
      "Communicate regularly with your assigned mentors",
      "Complete the project within the designated timeline"
    ],
    eligibility: [
      "Must be 18 years or older",
      "Beginner or student developer"
    ],
    benefits: [
      "Stipend provided upon successful evaluations",
      "Work on software used by millions",
      "Mentorship from experienced developers"
    ],
    postedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    applyLink: "https://summerofcode.withgoogle.com/"
  },
  {
    title: "MLH Fellowship (Software Engineering)",
    company: "Major League Hacking (MLH)",
    companyWebsite: "https://mlh.io",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "Educational Stipend Provided",
    duration: "12 weeks",
    requirements: ["React", "Node.js", "Python", "Git", "Full Stack"],
    description: "The MLH Fellowship is a 12-week internship alternative for aspiring software engineers. Our programs pair fun, educational curriculum with practical experience.",
    responsibilities: [
      "Contribute to real-world open source projects",
      "Collaborate in a pod with global developers",
      "Participate in daily standups and code reviews"
    ],
    eligibility: [
      "Must be a student or early-career professional",
      "Available for a 12-week remote commitment",
      "Proficiency in at least one modern programming language"
    ],
    benefits: [
      "Global networking and mentorship",
      "Stipend to support your learning",
      "Direct contributions to major open source codebases"
    ],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    applyLink: "https://fellowship.mlh.com/"
  },
  {
    title: "LFX Mentorship (Cloud Native)",
    company: "The Linux Foundation",
    companyWebsite: "https://linuxfoundation.org",
    location: "Remote India",
    type: "Remote",
    paid: true,
    stipend: "$3,000 USD total",
    duration: "12 weeks",
    requirements: ["Cloud Native", "Kubernetes", "Go", "Backend"],
    description: "The LFX Mentorship program trains the next generation of open source developers. Work on graduated CNCF projects like Kubernetes, Prometheus, and Envoy.",
    responsibilities: [
      "Resolve specific issues in CNCF repositories",
      "Improve cloud infrastructure tooling",
      "Engage with project maintainers and attend SIG meetings"
    ],
    eligibility: [
      "Must be 18 years or older",
      "Enrolled in a degree program or recent graduate"
    ],
    benefits: [
      "Direct mentorship from top engineers in the CNCF ecosystem",
      "Stipend based on country of residence",
      "Invaluable networking within the Linux Foundation"
    ],
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    applyLink: "https://mentorship.lfx.linuxfoundation.org/"
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/career_ai';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected for Seeding...');

    await Internship.deleteMany({});
    console.log('Cleared existing internships.');

    await Internship.insertMany(internshipsData);
    console.log('Successfully seeded 10 highly realistic Internship listings!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();