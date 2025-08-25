import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyServiceService } from '../my-service.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons'; // For buttons styling (optional)

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule, GridModule, ButtonsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  employees: any = [];
  inviteResult: any = null;

  constructor(private employeeService: MyServiceService) { }

  skip = 0;
  pageSize = 8;

  pageChange(event: any) {
  this.skip = event.skip;
}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
  this.employeeService.GetAllEmployees().subscribe({
    next: (data: any) => {
      const employees = data?.employees;
      this.employees = Array.isArray(employees) ? employees : employees ? [employees] : [];
    },
    error: (err) => console.error('Error loading employees', err)
  });
}

  inviteUser(empId: number): void {
    this.employeeService.inviteUser(empId).subscribe({
      next: (res) => {
        this.inviteResult = res;
        alert(`Invitation sent!\nUsername: ${res.username}\nPassword: ${res.password}`);
      },
      error: (err) => {
        console.error('Error inviting user', err);
        alert('Failed to send invite. Please try again.');
      }
    });
  }
}
