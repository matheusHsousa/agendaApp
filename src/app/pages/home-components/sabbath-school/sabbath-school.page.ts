import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-sabbath-school',
  templateUrl: './sabbath-school.page.html',
  styleUrls: ['./sabbath-school.page.scss'],
  standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class SabbathSchoolPage implements OnInit {

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
  }

  voltar() {
    this.navigationService.back();
  }
}
