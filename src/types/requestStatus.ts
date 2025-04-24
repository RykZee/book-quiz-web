import { Dispatch, SetStateAction } from "react";

export interface RequestStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export type SetRequestStatus = Dispatch<SetStateAction<RequestStatus>>;
