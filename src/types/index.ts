// Re-export Config and OutputFormat from config module
export type { Config, OutputFormat } from '../config';

// API Response types
export interface APIResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// Notebook types
export interface Notebook {
  id: string;
  name: string;
  icon: string;
  sort: number;
  closed: boolean;
}

// Document types
export interface Document {
  id: string;
  title: string;
  hpath: string;
  box: string;
  type: string;
  updated: string;
}

// Block types
export interface Block {
  id: string;
  type: string;
  subType?: string;
  content: string;
  parentID?: string;
  created: string;
  updated: string;
}

export interface BlockAttributes {
  id: string;
  attrs: Record<string, string>;
}

// Request types
export interface CreateDocRequest {
  notebook: string;
  path: string;
  markdown?: string;
  parentId?: string;
}

export interface UpdateBlockRequest {
  id: string;
  dataType: 'markdown' | 'dom';
  data: string;
}

export interface InsertBlockRequest {
  dataType: 'markdown' | 'dom';
  data: string;
  previousID?: string;
  nextID?: string;
  parentID?: string;
}

export interface MoveDocRequest {
  fromPaths: string[];
  toNotebook: string;
  toPath: string;
}

export interface MoveDocByIDRequest {
  fromIDs: string[];
  toID: string;
}

// Export result type
export interface ExportResult {
  content: string;
  hPath?: string;
}

// SQL query result
export interface SQLQueryResult {
  data: unknown[][];
  columns?: string[];
}
