import { Profile } from '../types/Profile';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies. Love building scalable applications and mentoring junior developers.',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahdev',
      github: 'https://github.com/sarahj',
    },
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Product Designer',
    email: 'michael.chen@designstudio.com',
    phone: '+1 (555) 987-6543',
    bio: 'Creative product designer specializing in mobile and web interfaces. Expert in user research, prototyping, and design systems with a focus on accessibility.',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/michaelchen',
      twitter: 'https://twitter.com/mikeChenDesign',
    },
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Data Scientist',
    email: 'emily.rodriguez@datalab.ai',
    phone: '+1 (555) 456-7890',
    bio: 'Data scientist with expertise in machine learning, statistical analysis, and data visualization. PhD in Statistics with focus on predictive modeling.',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      github: 'https://github.com/emily-data',
    },
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'DevOps Engineer',
    email: 'david.kim@cloudops.io',
    phone: '+1 (555) 321-0987',
    bio: 'DevOps engineer passionate about automation, infrastructure as code, and cloud architecture. Specialist in AWS, Kubernetes, and CI/CD pipelines.',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/davidkim',
      github: 'https://github.com/david-devops',
      twitter: 'https://twitter.com/davidCloudOps',
    },
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    title: 'Mobile App Developer',
    email: 'jessica.taylor@mobileapps.com',
    phone: '+1 (555) 654-3210',
    bio: 'React Native and Flutter developer with 6+ years building cross-platform mobile applications. Expert in performance optimization and native integrations.',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/jessicataylor',
      github: 'https://github.com/jessica-mobile',
    },
  },
];
