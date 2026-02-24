declare module '*.png' {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

export interface TournamentCardProps {
  title: string;
  status: string;
  format: string;
  type: string;
  location: string;
  participants: string; 
  minAge: string;      
  dates: string;
  buttons: { label: string; primary?: boolean }[];
  onJoinClick?: () => void;
}

export interface ButtonProps {
  label: string;
  primary?: boolean;
}