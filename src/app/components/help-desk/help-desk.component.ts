import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help-desk',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './help-desk.component.html',
  styleUrl: './help-desk.component.css'
})

export class HelpDeskComponent {

}
