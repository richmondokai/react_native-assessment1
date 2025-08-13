export interface Profile {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface ContactAction {
  type: 'call' | 'email' | 'message';
  value: string;
  icon: string;
}
