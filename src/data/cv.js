// ---------------------------------------------------------------------------
// SITE CONTENT — single source of truth.
//
// Everything the site displays is read from this file. To update the
// portfolio after a new certification, project, or job, edit the relevant
// array below and rebuild (`npm run build`) — no HTML/JS edits needed.
//
// Placeholders you should fill in are marked  // TODO
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Kislay Anand',
  role: 'Cybersecurity Enthusiast · VAPT · OSINT · Full-Stack Dev',
  tagline:
    'B.Tech CSE student focused on offensive security, web application testing, and building secure systems from the ground up.',
  location: 'Punjab, India',
  links: {
    github: 'https://github.com/kislay-anand',
    linkedin: 'https://www.linkedin.com/in/kislay-anand-rt/',
  },
  resumeFile: './Kislay_Anand_Resume.pdf',
  contact: {
    // TODO: create a free form at https://formspree.io (or any compatible
    // service — Getform, Web3Forms, etc.), point it at your inbox from
    // within that service's own dashboard, and paste the resulting
    // endpoint URL here, e.g. 'https://formspree.io/f/abcdwxyz'.
    //
    // Deliberately, no email address lives anywhere in this codebase —
    // the destination inbox is configured entirely on the form provider's
    // side, so it's never visible in this public repo, the page source,
    // or dev tools. See README "Contact form" for full setup steps.
    formEndpoint: '',
  },
};

export const summary =
  'Computer Science undergraduate with hands-on experience across VAPT, OSINT, web application security, and cryptography. ' +
  'Comfortable working the full stack — from Arduino/hardware builds to Active Directory lab administration to no-code web products — ' +
  'and applies the same rigor to writing secure code as to breaking insecure code.';

export const skills = [
  {
    category: 'Programming & Scripting',
    items: ['Python', 'C/C++', 'JavaScript', 'Bash'],
  },
  {
    category: 'Cybersecurity',
    items: ['VAPT', 'OSINT', 'Web Application Security', 'Cryptography', 'Steganography'],
  },
  {
    category: 'Tools & Platforms',
    items: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Git', 'GitHub', 'Figma', 'Vercel',
      'Nmap', 'Wireshark', 'Burp Suite', 'Metasploit', 'SQLMap', 'Hydra',
      'ffuf', 'Hashcat', 'OpenVAS', 'Netcat',
    ],
  },
  {
    category: 'Core CS Fundamentals',
    items: ['DBMS', 'Operating Systems', 'Computer Networks', 'SQL', 'OOPs'],
  },
  {
    category: 'Soft Skills',
    items: ['Time Management', 'Leadership', 'Problem-Solving', 'Adaptability', 'Analytical Thinking'],
  },
];

export const experience = [
  {
    title: 'Young Innovator Internship Challenge',
    period: "Apr '24 – Jun '24",
    type: 'Internship',
    points: ['Designed and developed a no-code website.'],
    certificateUrl:
      'https://drive.google.com/file/d/1o56jShT1h4MKBtBbBy_InsYpQx016-kQ/view?usp=sharing',
  },
];

export const projects = [
  {
    title: 'Local Lab for Security Testing',
    period: "Jun '26",
    summary: 'A self-hosted lab environment for practicing intermediate attack techniques safely.',
    points: [
      'Developed a local lab on Windows Server 2019 for intermediate attacks',
      'Managed Active Directory server administration and users',
      'Configured multiple services',
    ],
    tags: ['Windows Server', 'Active Directory', 'Home Lab'],
  },
  {
    title: 'Emergency Power-Cut & Alert System',
    period: "Nov '25",
    summary: 'A hardware safety device that cuts grid power on demand and alerts authorities via SMS.',
    points: [
      'Developed hardware to cut power from the grid via a physical button',
      'Added a GSM module to send alert messages to authorities',
      'Programmed the Arduino board in C++',
    ],
    tags: ['Arduino', 'C++', 'GSM', 'Hardware'],
  },
];

export const labs = [
  {
    title: 'Live Practical Training Program — Sam Community',
    period: "Nov '25",
    points: [
      'Built malware samples in a controlled lab environment for defensive research',
      'Practiced OSINT techniques as part of a supervised training exercise',
      'Gained hands-on experience with web exploitation',
    ],
  },
];

export const certifications = [
  {
    title: 'EC-Council — Certified Ethical Hacker (CEH)',
    period: "Aug '26",
    points: [
      'Studied cyber-attack methodology, attack types, and digital forensics',
      'Worked hands-on with Wireshark, Nmap, and Burp Suite',
      'Practiced multiple attack types and planning methodologies in lab environments',
    ],
  },
];

export const certificates = [
  { title: 'Programming Fundamentals using Python – Part 1', issuer: 'Infosys Springboard', period: "Jul '26" },
  { title: 'Programming Fundamentals using Python – Part 2', issuer: 'Infosys Springboard', period: "Jul '26" },
  { title: 'Advent of Cyber 2025', issuer: 'TryHackMe', period: "Dec '25" },
  { title: 'Computer Programming', issuer: 'iamneo', period: "May '26" },
  { title: 'Indian Laws: Know Your Rights', issuer: 'Learn Foundation Online', period: "May '25" },
  { title: 'Drop Certified Security Course', issuer: 'Drop Organization', period: "Jul '24" },
];

export const education = [
  {
    school: 'Lovely Professional University',
    location: 'Punjab, India',
    degree: 'B.Tech — Computer Science and Engineering',
    metric: 'CGPA: 8.53',
    period: "Aug '25 – Present",
  },
  {
    school: '+2 High School Sabour',
    location: 'Bihar, India',
    degree: 'Intermediate',
    metric: 'Percentage: 64.6%',
    period: "Apr '23 – Mar '25",
  },
  {
    school: '+2 High School Sabour',
    location: 'Bihar, India',
    degree: 'Matriculation',
    metric: 'Percentage: 84.4%',
    period: "Apr '22 – Mar '23",
  },
];

// The source CV has no publications listed. Add entries here if that changes —
// the Publications nav link/section only renders when this array is non-empty.
export const publications = [];
