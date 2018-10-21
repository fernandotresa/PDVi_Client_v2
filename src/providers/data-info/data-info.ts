import { Injectable } from '@angular/core';

@Injectable()
export class DataInfoProvider {

  titleAtention: string = "Atenção"
  titleStartDateEmpty: string = "Data inicial vazia"
  titleEndDateEmpty: string = "Data final vazia"
  titleCheckDates: string = "Verificar datas"
  titleResultEmpty: string = "Resultado vazio"

  constructor() {
    console.log('Hello DataInfoProvider Provider');
  }

}
