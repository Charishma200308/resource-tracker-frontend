import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Details } from '../../../interfaces/interface';
import { MyServiceService } from '../../my-service.service';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GridComponent, KENDO_GRID } from "@progress/kendo-angular-grid";
import { MatIconModule } from '@angular/material/icon';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component';


@Component({

  selector: 'app-details',
  standalone: true,
  imports: [FormsModule, CommonModule, KENDO_GRID, MatIconModule, WelcomeModalComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})

export class DetailsComponent {

  details: Details[] = []
  username: string = '' ;

  constructor(private myService: MyServiceService, private router: Router, private route1: ActivatedRoute) { }

  ngOnInit() {
    this.myService.username$.subscribe(name => {
      this.username = name || '';
    });

    this.myService.setUsername();

    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loading = true;
    this.myService.GetAllEmployees().subscribe((data: any) => {
      const EmployeeData = data?.employees;
      this.details = Array.isArray(EmployeeData) ? EmployeeData : [EmployeeData];
      this.loading = false;
      this.loadGridData();
    });
  }

  public gridView!: GridDataResult;

  state: any = {
    skip: 0,
    take: 3,
    sort: [],

    filter: undefined
  };

  loading: boolean = false;


  pageSize = 3;
  skip = 0;

  onPageChange(event: any): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.state.skip = this.skip;       // Update state.skip as well
    this.state.take = this.pageSize;   // Update state.take
    this.loadGridData();                // Refresh the grid data view
  }


  onStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.loadGridData();
  }
  
  loadGridData(): void {
    this.gridView = process(this.details, this.state);
  }

  // sortColumn: string = '';
  // sortDirection: 'asc' | 'desc' = 'asc';

  // sortData(column: string) {
  //   if (this.sortColumn === column) {
  //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     this.sortColumn = column;
  //     this.sortDirection = 'asc';
  //   }
  // }

  // currentPage: number = 1;
  // inputPage: number = 1;
  // itemsPerPage: number = 3;

  // get totalPages(): number {
  //   return Math.ceil(this.details.length / this.itemsPerPage);
  // }

  // get pagedDetails() {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   let pageData = this.details.slice(start, end);

  //   if (this.sortColumn) {
  //     pageData = pageData.sort((a: any, b: any) => {
  //       const valA = a[this.sortColumn]?.toLowerCase?.() || '';
  //       const valB = b[this.sortColumn]?.toLowerCase?.() || '';
  //       if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
  //       if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   return pageData;
  // }

  // goToPage(page: number) {
  //   if (page < 1) page = 1;
  //   if (page > this.totalPages) page = this.totalPages;
  //   this.currentPage = page;
  //   this.inputPage = page;
  // }

  Showhim(empId: number) {
    this.router.navigate([`/Details/${empId}`]);
  }

  delete(empId: number) {
    this.myService.DeleteEmployee(empId).subscribe((response: any) => {
      console.log('Employee deleted successfully:', response);
      this.fetchEmployees(); // Refresh the employee list after deletion
    });
    
    this.closeDelete();
  }

  showDelete: boolean = false;
  selectedEmpIdForDelete: number | null = null;

  deleteFunction(empId: number) {
    this.selectedEmpIdForDelete = empId;
    this.showDelete = true;
  }

  closeDelete() {
    this.showDelete = false;
  }

  editDetaills(empId: number) {
    this.router.navigate([`/Edit/${empId}`]);
  }

  // createEmptyRows(): any[] {
  //   const count = this.itemsPerPage - this.pagedDetails.length;
  //   return Array(count).fill({});
  // }

  bulkEditMode: boolean = false;
  selectedResourceIds: Set<number> = new Set();
  resourcesList: Details[] = [];

  toggleBulkEdit() {
    this.bulkEditMode = !this.bulkEditMode;
    this.selectedResourceIds.clear();
  }


  navigateToBulkEdit() {
    if (this.selectedResourceIds.size === 0) {
      alert('Please select at least one employee to edit.');
      return;
    }
    const idsArray = Array.from(this.selectedResourceIds);
    this.router.navigate(['/bulk-edit'], { queryParams: { ids: idsArray.join(',') } });
  }


  onResourceSelect(id: number, event: any) {
    if (event.target.checked) {
      this.selectedResourceIds.add(id);
    } else {
      this.selectedResourceIds.delete(id);
    }
  }


  handleCSVUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      this.parseAndSaveCSV(text);
    };

    reader.readAsText(file);
  }

  parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  parseAndSaveCSV(csvText: string): void {
    const lines = csvText.trim().split('\n');
    const headers = this.parseCSVLine(lines[0]);

    const newDetails: Details[] = [];
    const existingMaxId = this.details.reduce((max, item) => Math.max(max, Number(item.empId) || 0), 0);
    let saveCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const detail: any = {};

      detail.empId = existingMaxId + i;

      headers.forEach((header, index) => {
        const key = header.toLowerCase().trim();
        const value = values[index]?.trim() ?? '';

        switch (key) {
          case 'name':
            detail.name = value;
            break;
          case 'designation':
          case 'dsgntion':
            detail.dsgntion = value;
            break;
          case 'reporting':
            detail.reporting = value;
            break;
          case 'billable':
            detail.billable = value;
            break;
          case 'skills':
            detail.skills = value; 
            break;
          case 'project allocation':
          case 'projalloc':
            detail.projalloc = value;
            break;
          case 'location':
            detail.location = value;
            break;
          case 'email id':
          case 'mail':
            detail.mail = value;
            break;
          case 'cte doj':
          case 'doj':
            detail.doj = value;
            break;
          case 'remarks':
            detail.remarks = value;
            break;
        }
      });

      newDetails.push(detail);
      this.details.push(detail);

      this.myService.AddEmployee(detail).subscribe({
        next: () => {
          saveCount++;
          if (saveCount === lines.length - 1) {
            this.fetchEmployees(); // refresh UI
            alert(`${saveCount} records imported and saved successfully.`);
          }
        },
        error: (err) => {
          console.error(`Failed to save employee at line ${i + 1}`, err);
        }
      });
    }
  }

}
