export class PostProductsForPreInvoicesDTO {
  lojaId: number;
  dataProcedimento: string;
  procedimento: string;
  nomeMedico: string;
  pagamento: string;
  CRM: string;
  nomePaciente: string;
  Obsevacao: string;
  nomeConvenio: string;
  branchConvenio: string;
  codigoConvenio: string;
  pedidos: OrdersForPreInvoices[];
}

export class OrdersForPreInvoices {
  SolicitacaoId: number;
  produtosItemId: number[];
}

export class PostProductsForInvoicesDTO {
  CustomerCGC: string;
  OperationId: string;
  ExternalOrderNumber: number;
  InvoiceNumber: string | null;
  InvoiceSeries: string | null;
  InvoiceDate: string | null;
  ProductCode: number;
  BatchCode: string;
  Quantity: number;
  Status: 0 | 1; // 0 = CANCELADO, 1 = FATURADO
  Epcs: string[];
  LaboratoryId: string;
  Description?: string;
}

export class PostProductsForFirstEventInvoicesDTO {
  CustomerCGC: string;
  OperationId: string;
  ExternalOrderNumber: number;
  Status: 0 | 1; // 0 = CANCELADO, 1 = FATURADO
}
