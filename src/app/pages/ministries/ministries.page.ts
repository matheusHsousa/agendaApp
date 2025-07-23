import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MinistryService } from './../../services/ministries.service';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-ministries',
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MinistriesPage {
  ministerios: any[] = [];
  novoMinisterio: string = '';

  private subscription?: Subscription;

  constructor(private location: Location, private ministryService: MinistryService) { }

  ngOnInit() {
    this.subscription = this.ministryService.listarMinisterios().subscribe(data => {
      this.ministerios = data;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async adicionarMinisterio() {
    if (!this.novoMinisterio.trim()) return;
    await this.ministryService.criarMinisterio({ nome: this.novoMinisterio });
    this.novoMinisterio = '';
  }

  async deletarMinisterio(id: string) {
    await this.ministryService.deletarMinisterio(id);
  }

  voltar() {
    this.location.back();
  }
}
