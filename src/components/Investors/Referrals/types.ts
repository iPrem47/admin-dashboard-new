export interface Reference {
  id: string;
  name: string;
  referenceId: string;
  deleted: boolean;
  updatedAt: string;
  totalInvestors: number;
}

export interface ReferencesApiResponse {
  results: Reference[];
  totalPages: number;
  totalResults: number;
}

export interface ReferenceFilters {
  search: string;
}