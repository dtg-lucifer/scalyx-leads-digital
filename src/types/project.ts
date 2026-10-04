export type ProjectStatus =
  | 'Planning'
  | 'Design'
  | 'In Progress'
  | 'Review & QA'
  | 'Completed'
  | 'On Hold';

export interface Project {
  id: string;
  leadId?: string;
  leadName?: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  budget: number;
  currency: string;
  kanbanUrl?: string; // external link to Trello/Jira/Linear/etc.
  startDate?: string;
  targetDate?: string;
  assignedTeammates?: string[];
  createdAt: string;
  updatedAt: string;
}
