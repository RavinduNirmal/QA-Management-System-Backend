import { Request } from 'express';

//Get Pagination Params
export function getPaginationParams(req: Request) {
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
  return { page, limit };
}