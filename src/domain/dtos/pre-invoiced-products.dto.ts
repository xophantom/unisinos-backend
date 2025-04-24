export class InvoicedProductsResponseDTO {
  Success: boolean;
  Message: string;
}

///

export class InvoicedProductsRequestDTO {
  CustomerCGC: string;
  BranchCGC: string;
  OperationId: string;
  LaboratoryId: string;
  OrderMessage: string;
  PaymentTermCode: string;
  UpdatedByUser: string;
  Installments: InstallmentsDTO;
  MedicalProfessionalName: string;
  MedicalProfessionalLicense: string;
  PatientName: string;
  InsuranceCustomerCode: string;
  InsuranceCustomerBranch: string;
  InsuranceName: string;
  InvoiceCustomerCode: string;
  InvoiceCustomerBranch: string;
  UpdateDate: string;
  UpdateTime: string;
  ConsignmentType: string;
  OperationDate: string;
  Items: InvoicedEntityProductsItemResponseDTO[];
}

export class InstallmentsDTO {
  Installment1Value: number;
  Installment1Date: string;
  Installment2Value: number;
  Installment2Date: string;
  Installment3Value: number;
  Installment3Date: string;
  Installment4Value: number;
  Installment4Date: string;
}

export class InvoicedEntityProductsItemResponseDTO {
  ExternalOrderNumber: string;
  ProductCode: string;
  Quantity: number;
  ConsignmentItem: string;
  ConsignmentCode: string;
  Price: number;
  TotalValue: number;
  BatchCode: string;
  Epcs: string[];
  EPC?: string;
}
