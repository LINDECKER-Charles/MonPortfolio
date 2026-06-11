import { ResponsiveSource } from '../../assets/responsive-picture/responsive-picture';

export interface Period {
  dateStart: Date;
  dateEnd?: Date;
  isEnd: boolean;
}

export interface ProjectMediaImage {
  alt: string;
  fallbackSrc: string;
  sources: ResponsiveSource[];
}

export interface ProjectDetail {
  video?: string;
  images?: ProjectMediaImage[];
  lessonsLearned?: string[];
}

export type ProjectCategory =
  | 'personal'
  | 'open_source'
  | 'client';

export type ProjectStatus =
  | 'done'
  | 'in_progress'
  | 'archived';

export interface ProjectLinkSet {
  github?: string;
  demo?: string;
  website?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  period: Period;
  shortDescription: string;
  longDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  stack: string[];
  tags: string[];
  links: ProjectLinkSet;
  highlights: string[];
  detail?: ProjectDetail;
  featured?: boolean;
}

export interface ProjectFilterItem {
  id: ProjectCategory | 'all';
  label: string;
}

export interface ProjectFiltersState {
  category: ProjectCategory | 'all';
  tags: string[];
  stack: string[];
}
