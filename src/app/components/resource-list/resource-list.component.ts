import { CommonModule, formatCurrency } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Details } from '../../../interfaces/interface';
import { MyServiceService } from '../../my-service.service';


@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.css'
})

export class ResourceListComponent {

  constructor(private http: MyServiceService,private router:Router) {
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        this.showNavbar = !['/login', '/signup'].includes(currentRoute);
      }
    });
   }

  username: string = '' ;
  
  ngOnInit() {
    this.http.username$.subscribe(name => {
      this.username = name || '';
    });

    this.http.setUsername();

    this.fetchEmployeeData();
  }

  showNavbar: boolean = true;

  logout() {
  localStorage.removeItem('token'); 
  this.router.navigate(['/login']); 
}

  details: Details[] = []

  fetchEmployeeData() {
    this.http.GetAllEmployees().subscribe((data: any) => {
      console.log('API response:', data);
      let EmployeeData = data?.employees;
      this.details = Array.isArray(EmployeeData) ? EmployeeData : [EmployeeData];
    });
  }

  exportToCSV(): void {
    console.log(this.details);
    const csvRows: string[] = [];
    const headers = [
      'Employee ID',
      'Name',
      'Designation',
      'Reporting To',
      'Billable',
      'Tech Skill',
      'Project Allocation',
      'Location',
      'Email ID',
      'CTE DOJ',
      'Remarks'
    ];

    csvRows.push(headers.join(','));

    this.details.forEach((item: Details) => {
      const row = [
        item.empId,
        item.name,
        item.dsgntion,
        item.reporting,
        item.billable,
        item.skills,
        item.projalloc,
        item.location,
        item.mail,
        item.doj,
        item.remarks
      ].map(field => `"${String(field).replace(/"/g, '""')}"`);
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EmployeeDetails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
