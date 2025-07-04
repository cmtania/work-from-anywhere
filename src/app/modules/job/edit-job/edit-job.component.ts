import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription, take, tap } from 'rxjs';
import { JobModel } from '../../model/job-model';
import { Company } from '../../model/company.enum';
import { JobService } from '../../services/job-services';
import { Store } from '@ngxs/store';
import { HideSpinner, ShowSpinner } from '../../state-management/actions/spinner.action';
import { JobState } from '../../state-management/states/job.state';
import { UpdateJob } from '../../state-management/actions/job.action';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  editJobForm!: FormGroup;
  isUpdating: boolean = true;
  jobId: number;
  isSuccessNotif: boolean = true;
  public subscription: Subscription = new Subscription();
  companyList: any[] = [];

  private readonly _store: Store;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly _jobService: JobService,
    
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._store = injector.get(Store);
    this.jobId = Number(this._route.snapshot.params.id);
  }

  ngOnInit(): void {
    this.companyList = this.getCompany();
    this.initForm();
    this.getJob();
  }

  initForm(): void {
    this.editJobForm = this.fb.group({
      JobTitle: ['', [Validators.required]],
      CompanyId: [undefined, [Validators.required]],
      JobType: ['', [Validators.required]],
      JobDescription: ['', [Validators.required]],
      Salary: [1, [Validators.required, Validators.min(1)]],
    });
  }

  getJob() {
    this._store.dispatch(new ShowSpinner());
    const jobData = this._store.selectSnapshot(JobState.getJobs) as Array<JobModel>;
    const job = jobData.find(x => x.JobId === this.jobId);
    if(job) {
      this.editJobForm.patchValue({
        JobTitle: job.JobTitle,
        CompanyId: job.CompanyId,
        JobType: job.JobType,
        JobDescription: job.JobDescription,
        Salary: job.Salary
      });
    }

    this._store.dispatch(new HideSpinner());
  }

  updateJob() {
    if (this.editJobForm.invalid) return;
    this._store.dispatch(new ShowSpinner());
    const updatedJob: JobModel = {
      ...this.editJobForm.value,
      JobId: this.jobId,
      UpdatedBy: 'hradmin',
      UpdatedDate: new Date().toISOString(),
      Purge: 'N'
    };

    this._store.dispatch(new UpdateJob(updatedJob));
    this._store.dispatch(new HideSpinner());
  }

  getCompany(): any[] {
    let enumCompany = Object.keys(Company)
      .map((key: any) => Company[key])
      .filter(k => !(parseInt(k) >= 0));
    let num = 1;
    let res = [];
    for (const key in enumCompany) {
      res.push({ id: num, value: enumCompany[key] });
      num++;
    }
    return res;
  }

  backtoList() {
    this._router.navigateByUrl("/job-dashboard");
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}