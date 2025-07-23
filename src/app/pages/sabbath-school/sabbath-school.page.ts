import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-sabbath-school',
  templateUrl: './sabbath-school.page.html',
  styleUrls: ['./sabbath-school.page.scss'],
  standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class SabbathSchoolPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  
  voltar() {
    this.location.back();
  }

}
