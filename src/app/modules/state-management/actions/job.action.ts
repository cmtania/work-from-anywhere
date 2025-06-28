import { JobModel } from "../../model/job-model";

export class AddJob {
  static readonly type = '[Job] Add new job';
  constructor(public payload: JobModel) {}
}

export class LoadJobs {
    static readonly type = '[Job] Load jobs';
    constructor(public payload: JobModel[]) {}
  }

export class UpdateJob {
  static readonly type = '[Job] Update existing job';
  constructor(public payload: JobModel) {}
}

export class DeleteJob {
  static readonly type = '[Job] Delete job';
  constructor(public payload: number) {}
}
