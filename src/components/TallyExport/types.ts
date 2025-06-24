export interface TallyExportFormData {
  type: string;
  fromDate: string;
  toDate: string;
}

export interface TallyExportPayload {
  type: string;
  fromDate: string;
  toDate: string;
}

export interface TallyExportResponse {
  statusCode: number;
  data: {
    buffer: {
      data: number[];
    };
    filename: string;
  };
  message: string;
  success: boolean;
}

export interface TypeOption {
  value: string;
  label: string;
}