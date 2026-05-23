import { FindManyOptions, Like } from 'typeorm';

/**
 * Generates a FindManyOptions object with dynamic search and pagination.
 * 
 * @param {Object} query - The request query parameters.
 * @param {Array<string>} validSearchColumns - List of valid columns to search.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {FindManyOptions} - The FindManyOptions object for TypeORM.
 */
export function  createFindOptions<T>(
  query: any,
  validSearchColumns: string[],
  page: number,
  limit: number
): FindManyOptions<T> {
  const { searchColumn, searchTerm } = query;
  
  // Base conditions
  const where: any = {};
  
  // Apply search condition if applicable
  if (searchColumn && searchTerm) {
    if (validSearchColumns.includes(searchColumn)) {
      where[searchColumn] = Like(`${searchTerm}%`);
    }
  }

  // Create FindManyOptions
  return {
    where,
    skip: (page - 1) * limit,
    take: limit,
  };
}

