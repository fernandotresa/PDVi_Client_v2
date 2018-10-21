import { Injectable } from '@angular/core';

@Injectable()
export class DataInfoProvider {

  titleAppName: string = "Vendas Online"
  titleCPF: string = "CPF"
  titleAtention: string = "Atenção"
  titleStartDateEmpty: string = "Data inicial vazia"
  titleEndDateEmpty: string = "Data final vazia"
  titleCheckDates: string = "Verificar datas"
  titleResultEmpty: string = "Resultado vazio"
  titleDayPurschase: string = "Data da compra"
  titleSettings: string = "Configurações"
  titleTicketType: string = "Tipo de ingresso"
  titleCategory: string = "Categorias"
  titleDayStart: string = "Data inicial"
  titleEndStart: string = "Data final"
  titleHistory: string = "Historico"
  titlePleaseWait: string = "Favor aguarde"
  titleEmailSendSuccess: string = "E-mail enviado com sucesso!"
  titlePrintSendSuccess: string = "Impressão enviada com sucesso!"
  titleSendEmailTo: string = "Enviar e-mail para "
  titleTicketOptions: string = " Opções ingresso"
  titleEmail: string = "E-mail"
  titleTicket: string = "Ingresso"
  titleTicketNumber: string = "Número do ingresso"
  titleTicketValue: string = "Valor da compra"
  titleTicketPayDay: string = "Data do pagamento"
  titleTicketPostDay: string = "Data da postagem"
  titleConfirmPrint: string = "Confirmar impressão "
  titleSearchingClientName: string = "Procurando pelo nome do cliente, favor aguarde"
  titleSearchingClientCPF: string = "Procurando pelo CPF do cliente, favor aguarde"
  titleConfirmMultiPrint: string = "Deseja confirmar impressão multipla?"
  titleStreet: string = "Rua"
  titleNumber: string = "Número"
  titleCity: string = "Cidade"
  titleCEP: string = "CEP"
  titleState: string = "Estado"
  titleBasic: string = "Básico"
  titleClientAddress: string = "Endereço comprador"

  constructor() {
    console.log('Hello DataInfoProvider Provider');
  }

}
