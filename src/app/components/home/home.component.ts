import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Details } from '../../../interfaces/interface';
import { MyServiceService } from '../../my-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  details: any
  empId: number = 1

  constructor(private myService: MyServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.empId = +this.route.snapshot.paramMap.get('empId')!;
    this.myService.GetEmployee(this.empId).subscribe((data: any) => {
      console.log("Data received from API:", data);
      this.details = Array.isArray(data) ? data : [data]
    })
  }

  downloadDetailsAsPDF(detail: Details) {
    const doc = new jsPDF();
    const lineHeight = 8;
    let y = 30;

    doc.setFillColor(63, 81, 181);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.rect(0, 0, 210, 15, 'F');
    doc.text('Employee Full Details', 105, 12, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const fields = [
      ['Name', detail.name],
      ['Employee ID', detail.empId],
      ['Designation', detail.dsgntion],
      ['Reporting', detail.reporting],
      ['Billable', detail.billable],
      ['Skills', detail.skills],
      ['Project Allocation', detail.projalloc],
      ['Location', detail.location],
      ['Email', detail.mail],
      ['Date of Joining', detail.doj],
      ['Remarks', detail.remarks],
    ];

    fields.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${value}`, 70, y);
      y += lineHeight;
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, y + 4, 190, y + 4);


    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y + 10);

    doc.save(`${detail.name}_details.pdf`);
  }

}
