import { ReactNode } from "react";

export interface SidebarProps {
  handleOnClick: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void;
  active: string;
}

export interface SideBarIconProps {
  children: ReactNode;
  href: string;
  isActive: boolean;
}

export interface ContributionGraphProps {
  contributions: number[];
}

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface CommunityCardProps {
  status: string;
}
export interface PostHeaderProps {
  profileImage: string;
  username: string;
  timestamp: string;
  category: string;
}
export interface PostContentProps {
  title: string;
  content: string;
}
export interface ShareButtonProps {
  url?: string;
  title?: string;
}
export interface GroupProps {
  num: number;
}
