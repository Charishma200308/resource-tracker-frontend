import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyServiceService } from '../../my-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-mini-form',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,MatFormFieldModule,
      MatSelectModule,
      MatChipsModule,
      MatIconModule,
      MatOptionModule],
  templateUrl: './mini-form.component.html',
  styleUrl: './mini-form.component.css'
})
export class MiniFormComponent {

  bulkEditForm: FormGroup = new FormGroup({
  dsgntion: new FormControl(""),
  reporting: new FormControl(""),
  billable: new FormControl(""),
  skills: new FormControl(""),
  projalloc: new FormControl(""),
  location: new FormControl(""),
  doj: new FormControl(""),
});

bulkEditMode: boolean = false;
selectedResourceIds: Set<number> = new Set();
selectedEmployees: any[] = [];

constructor(private http: MyServiceService, private router: Router, private route: ActivatedRoute) { }


  locations: string[] = [];
  designations: string[] = [];
  billableStatuses: string[] = [];
  skills:string[]=[];
  projects: string[] = [];

  loadDropdownData() {
    this.http.GetLocation().subscribe({
      next: (data: any) => {
        this.locations = data;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
      }
    });

    this.http.GetDesignation().subscribe({
      next: (data: any) => {
        this.designations = data;
      },
      error: (err) => {
        console.error('Error loading designations:', err);
      }
    });


    this.http.GetBillablestatuses().subscribe({
      next: (data: any) => { this.billableStatuses = data; },
      error: (err) => console.error('Error loading billable statuses:', err)
    });

    this.http.GetSkills().subscribe({
      next: (data:any) => {this.skills = data;},
      error: (err) => console.error('Error loading Skills:',err)
    });

    this.http.GetProjects().subscribe({
      next: (data: any) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      }
    });
  }

  applyBulkUpdate() {
  if (this.bulkEditForm.invalid) {
    alert('Please fix form errors before submitting.');
    return;
  }

  const formValues = this.bulkEditForm.value;

  // Collect only non-empty fields
  const fieldsToUpdate: any = {};
  for (const key in formValues) {
    const value = formValues[key];
    if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      // Convert arrays to comma-separated strings (for skills and projalloc)
      fieldsToUpdate[key] = Array.isArray(value) ? value.join(',') : value;
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    alert('Please fill at least one field to apply bulk update.');
    return;
  }

  if (this.selectedResourceIds.size === 0) {
    console.warn('No employees selected');
    return;
  }

  // Build payload with updated values
  const payload = this.selectedEmployees.map(emp => {
    const updatedEmp = { ...emp };

    for (const key in fieldsToUpdate) {
      updatedEmp[key] = fieldsToUpdate[key];
    }

    return updatedEmp;
  });

  // Send to backend
  this.http.BulkUpdateEmployees(payload).subscribe({
    next: () => {
      alert('Bulk update successful!');
      this.bulkEditForm.reset();
      this.bulkEditMode = false;
      this.selectedResourceIds.clear();

      setTimeout(() => this.router.navigate(['/']), 500);
    },
    error: (err) => {
      console.error('Bulk update failed:', err);
      const errorMsg = err?.error?.errors ? JSON.stringify(err.error.errors) : 'Bulk update failed!';
      alert(errorMsg);
    }
  });
}


ngOnInit(): void {
    this.loadDropdownData();

    this.route.queryParams.subscribe(params => {
      if (params['ids']) {
        const ids = params['ids'].split(',').map((id: string) => +id);
        this.selectedResourceIds = new Set(ids);
        this.bulkEditMode = true;  // show form
        this.fetchSelectedEmployees(ids); // fetch employee data by ids
      } else {
        alert('No employees selected for bulk edit.');
        this.router.navigate(['/']);
      }
    });
  }

  fetchSelectedEmployees(ids: number[]) {
    this.selectedEmployees = [];

    ids.forEach(id => {
      this.http.GetEmployee(id).subscribe({
        next: (emp: any) => {
          this.selectedEmployees.push(emp);
        },
        error: (err) => {
          console.error(`Error fetching employee with id ${id}`, err);
        }
      });
    });
  }

}
