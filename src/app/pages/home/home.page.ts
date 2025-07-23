import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ScheduleService } from 'src/app/services/schedule.service';
import moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class HomePage {
  role: string | null = null;
  isAdmin = false;
  proximosEventos: any[] = [];

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.authService.user$.subscribe(async user => {
      if (user) {
        this.role = user.role || null;
        this.isAdmin = this.role === 'Admin';
        await this.carregarProximosEventos(user.uid);
      }
    });

  }



  ngOnInit() {
  }

abrirPix() {
  const pixKey = 'seu-email@dominio.com';
  const merchantName = 'Seu Nome Completo';
  const merchantCity = 'Cidade';
  const txid = '1234567890';

  // Função auxiliar para montar um campo EMV: tag + tamanho + valor
  function buildField(tag: string, value: string): string {
    const length = value.length.toString().padStart(2, '0');
    return `${tag}${length}${value}`;
  }

  // Montar os campos principais do payload PIX
  const payloadFormatIndicator = buildField('00', '01');
  const pointOfInitiationMethod = buildField('01', '12'); // 12 = valor dinâmico (valor livre)

  // Dados do pixKey (Merchant Account Information)
  // Tag 26, sub-tags:
  // 00 = GUI do BR Code
  // 01 = chave pix
  const merchantAccountInfoValue =
    buildField('00', 'BR.GOV.BCB.PIX') +
    buildField('01', pixKey);
  const merchantAccountInfo = buildField('26', merchantAccountInfoValue);

  // Merchant Category Code (default 0000 = sem categoria)
  const merchantCategoryCode = buildField('52', '0000');
  // Transaction Currency: 986 = BRL
  const transactionCurrency = buildField('53', '986');
  // Transaction Amount: omitido para valor livre
  // Txid (identificador da transação)
  const additionalDataFieldValue = buildField('05', txid);
  const additionalDataField = buildField('62', additionalDataFieldValue);

  // Merchant Name
  const merchantNameField = buildField('59', merchantName);
  // Merchant City
  const merchantCityField = buildField('60', merchantCity);

  // Construir payload parcial (sem CRC)
  const payloadWithoutCRC =
    payloadFormatIndicator +
    pointOfInitiationMethod +
    merchantAccountInfo +
    merchantCategoryCode +
    transactionCurrency +
    merchantNameField +
    merchantCityField +
    additionalDataField +
    '6304'; // Tag CRC (63), length 04, valor será calculado depois

  // Função para calcular CRC16-CCITT (XMODEM)
  function crc16xmodem(str: string): string {
    let crc = 0x0000;
    const polynomial = 0x1021;

    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      for (let j = 0; j < 8; j++) {
        const bit = ((c >> (7 - j)) & 1) === 1;
        const c15 = ((crc >> 15) & 1) === 1;
        crc <<= 1;
        if (c15 !== bit) crc ^= polynomial;
      }
    }
    crc &= 0xffff;
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  // Calcular CRC
  const crc = crc16xmodem(payloadWithoutCRC);

  // Payload final
  const payload = payloadWithoutCRC + crc;

  console.log('Payload PIX:', payload);

  // Montar intent para abrir app Nubank no Android
  const intentLink = `intent://${payload}#Intent;scheme=pix;package=br.com.nu.prod;end;`;

  // Abrir o link
  window.location.href = intentLink;
}





  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToUserSchedule() {
    this.router.navigate(['/user-schedule'])
  }

  goToSabbathSchool() {
    this.router.navigate(['/sabbath-school'])

  }

  async carregarProximosEventos(uid: string) {
    this.scheduleService.listarSchedules().subscribe((data) => {
      const todosEventos = data

      const agora = moment();
      const futuros = todosEventos.filter((e: any) => moment(e.dataHora).isSameOrAfter(agora));

      futuros.sort((a: any, b: any) => moment(a.dataHora).diff(moment(b.dataHora)));

      this.proximosEventos = futuros.slice(0, 3);
    })
  }

  formatarData(dataHora: string) {
    return moment(dataHora).format('dddd, DD/MM/YY');
  }

  formatarDia(dataHora: string) {
    return moment(dataHora).locale('pt-br').format('dddd, DD/MM');
  }

  formatarHora(dataHora: string) {
    return moment(dataHora).format('HH:mm');
  }

}
