import { CommonModule } from '@angular/common';
import { EventEmitter, Component, Output, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Details } from '../../../interfaces/interface';
import { MyServiceService } from '../../my-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatOptionModule],
  templateUrl: './resource-form.component.html',
  styleUrl: './resource-form.component.css'
})

export class ResourceFormComponent {
  constructor(private http: MyServiceService, private router: Router, private route: ActivatedRoute) { }

  

  empId!: number
  details: any = []
  editMode: boolean = false;
  showpopup: boolean = false;

  showCancelModal: boolean = false;


  canDeactivate(): boolean {
    if (this.editMode && this.userform.dirty) {
      return confirm('You have unsaved changes! Do you really want to leave?');
    }
    return true;
  }

  cancelFunction() {
    this.showCancelModal = true;
  }

  confirmCancel() {
    if (this.editMode && this.originalFormData) {
      this.userform.patchValue(this.originalFormData);
    } else {
      this.userform.reset();
    }
    this.closeCancelModal();
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }

  originalFormData!: Details;

  ngOnInit() {
    this.empId = +this.route.snapshot.paramMap.get('empId')!;

    if (this.empId) {
      this.editMode = true;
      this.http.GetEmployee(this.empId).subscribe((data: any) => {
        console.log(data);
        data.skills = data.skills?.split(',').map((s: string) => s.trim()) || [];
        this.userform.patchValue(data);
        this.originalFormData = { ...data };
      });
    } else {
      this.editMode = false;
    }

    this.userform.get('mail')?.valueChanges.subscribe(() => {
      const control = this.userform.get('mail');
      if (control?.hasError('notUnique')) {
        control.setErrors(null);
      }
    })

    this.loadDropdownData();
  
  }

  
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

  showSaveModal: boolean = false;

  confirmSaveFunction() {
    this.showSaveModal = true;
  }

  confirmSave() {
    this.saveFunction();
    this.showSaveModal = false;
  }

  closeSaveModal() {
    this.showSaveModal = false;
  }

  emailAlreadyExists: boolean = false;


  saveFunction() {
    if (this.userform.valid && this.editMode == false) {
      const formValue: Details = {
        ...this.userform.value,
        skills: (this.userform.value.skills as string[]).join(','),
        projalloc: (this.userform.value.projalloc as string[]).join(',')
      }
      this.http.AddEmployee(formValue).subscribe({
        next: (res) => {
          this.showpopup = true;
          this.userform.reset();
          this.editMode = false;
          setTimeout(() => {
            this.showpopup = false,
              this.router.navigate(['/Home'])
          }, 2000);
        },
        error: (err) => {
          if (err.status === 400 && err.error?.message === 'Email already exists.') {
            this.userform.controls['mail'].setErrors({ notUnique: true });
          }
        }
      });
      this.editMode = false;
    }

    else if (this.userform.valid && this.editMode == true) {
      const values: Details = {
        ...this.userform.value,
        skills: (this.userform.value.skills as string[]).join(','),
        projalloc: (this.userform.value.projalloc as string[]).join(',')
      }
      this.http.UpdateEmployee(this.empId, values).subscribe({
        next: (res) => {
          this.userform.markAsPristine();
          this.showpopup = true;
          setTimeout(() => {
            this.showpopup = false,
              this.router.navigate(['/Home'])
          }, 2000);
        },
        error: (err) => {
          console.error('AddEmployee error:', err);
        }
      })
    }
  }

  userform: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.minLength(5), Validators.required]),
    dsgntion: new FormControl("", Validators.required),
    reporting: new FormControl("", [Validators.required]),
    billable: new FormControl("", Validators.required),
    skills: new FormControl(""),
    projalloc: new FormControl("", Validators.required),
    location: new FormControl(""),
    mail: new FormControl("", [Validators.email, Validators.required]),
    doj: new FormControl("", Validators.required),
    remarks: new FormControl("")
  })

  editIndex: number | null = null;
  allDetails: Details[] = [];


  changeTab = 'Home';

  changetabfun(current: string) {
    this.changeTab = current;
  }

  resetForm() {
    this.userform.reset();
    this.editMode = false;
    this.editIndex = null;
  }

}
