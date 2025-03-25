export interface Form {
  id: number;
  userId: number;
  name: string;
  description?: string;
  jsonBlocks?: any;
  views: number;
  responses: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  responseCount: number;
}
