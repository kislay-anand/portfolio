// ---------------------------------------------------------------------------
// SITE CONTENT — single source of truth.
//
// Everything the site displays is read from this file. To update the
// portfolio after a new certification, project, or job, edit the relevant
// array below and refresh the page — no HTML/JS edits needed (this is a
// zero-build static site).
//
// Placeholders you should fill in are marked  // TODO
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Kislay Anand',
  role: 'Cybersecurity Enthusiast · VAPT · OSINT · CEH',
  tagline:
    'B.Tech (Hons.) CSE student focused on offensive security, web application testing, and building secure systems from the ground up.',
  location: 'Punjab, India',
  links: {
    github: 'https://github.com/kislay-anand',
    linkedin: 'https://www.linkedin.com/in/kislay-anand-rt/',
  },
  resumeFile: './Kislay_Anand_Resume.pdf',
  // TODO: replace with a real photo (square, at least 400x400px works best).
  // Drop the file in at the repo root and update this path — e.g. './photo.jpg'.
  photo: './photo.jpg',
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
  'Comfortable working across the stack — from Arduino/hardware builds to Active Directory lab administration to no-code web products — ' +
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
    title: 'Young Innovator Internship Challenge — Scalar School of Technology',
    period: "Apr '24 – Jun '24",
    type: 'Internship',
    points: ['Designed and developed a no-code website.'],
    certificateUrl:
      'https://drive.google.com/file/d/1LZVGQjamL4qzzoy8WiMkeEA4PZ2A0FsG/view?usp=drive_link',
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
    certificateUrl:
      'https://drive.google.com/file/d/1_P5Q9_Dbqrbq6DaQRNFTU9fDP8T9XJoj/view?usp=drive_link',
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
    certificateUrl:
      'https://drive.google.com/file/d/1qb3sgHkPhw7EGURjoTPIvVVU-LngsA3M/view?usp=drive_link',
  },
];

export const certificates = [
  {
    title: 'Programming Fundamentals using Python – Part 1',
    issuer: 'Infosys Springboard',
    period: "Jul '26",
    certificateUrl: 'https://drive.google.com/file/d/1vfYwb7pzweJjmjudsyf6gtOdY-biC-BK/view?usp=drive_link',
  },
  {
    title: 'Programming Fundamentals using Python – Part 2',
    issuer: 'Infosys Springboard',
    period: "Jul '26",
    certificateUrl: 'https://drive.google.com/file/d/1HmMObj7p28CdlHSBm2XFkXlqVUy-WrMA/view?usp=drive_link',
  },
  {
    title: 'Advent of Cyber 2025',
    issuer: 'TryHackMe',
    period: "Dec '25",
    certificateUrl: 'https://drive.google.com/file/d/1WGycWTaQP84i2Z8utl0vxB0FqEmbgrHV/view?usp=drive_link',
  },
  {
    title: 'Computer Programming',
    issuer: 'iamneo',
    period: "May '26",
    certificateUrl: 'https://drive.google.com/file/d/1QEoHj-6xGkrggS5gQrVwv9wFmisZMbOV/view?usp=sharing',
  },
  {
    title: 'Indian Laws: Know Your Rights',
    issuer: 'Learn Foundation Online',
    period: "May '25",
    certificateUrl: 'https://drive.google.com/file/d/1pmBJH0fqbVJQzbMd4tbYUar4CEp0tJCv/view?usp=drive_link',
  },
  {
    title: 'Drop Certified Security Course',
    issuer: 'Drop Organization',
    period: "Jul '24",
    certificateUrl: 'https://drive.google.com/file/d/1QERkHsf8uO8t3ISNi4c0PDduV6qTlZNL/view?usp=drive_link',
  },
];

export const education = [
  {
    school: 'Lovely Professional University',
    location: 'Punjab, India',
    degree: 'B.Tech. Hons. — Computer Science and Engineering',
    metric: 'CGPA: 8.53',
    period: "Aug '25 – Present",
  },
  {
    school: '+2 High School Sabour Bhagalpur',
    location: 'Bihar, India',
    degree: 'Intermediate',
    metric: 'Percentage: 63.6%',
    period: "Apr '23 – Mar '25",
  },
  {
    school: 'High School Sabour Bhagalpur',
    location: 'Bihar, India',
    degree: 'Matriculation',
    metric: 'Percentage: 74.6%',
    period: "Apr '22 – Mar '23",
  },
];

// The source CV has no publications listed. Add entries here if that changes —
// the Publications nav link/section only renders when this array is non-empty.
export const publications = [];
