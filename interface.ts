import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Client {
    id: string | number;
    name: string;
    team_key: string | number;
    brand_key: string | number;
    creatorid: string | number;
}
export interface CardProps {
    project_id: number,
    title: string;
    description: string;
    tags?: string[];
    dateRange?: string;
    status?: string;
    client_name?: string;
    brandLogo?: string | StaticImport;
    name?: string;
    created_by: string,
    team_key: number,
    teamMembers?: [],
    brand_key: number,
    created_at: string,
    editProject?: (projectData: any) => void,
    task_count: number
  }
export interface User {
    id: string | number;
    name: string;
    initials?: string;
    color?: string;
}