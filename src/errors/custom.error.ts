import { BadRequestError } from './bad-request.error';
import { ConflictError } from './conflict.error';
import { NotFoundError } from './not-found.error';
import { ServiceUnavailableError } from './service-unavailable.error';
import { UnprocessableError } from './unprocessable.error';

// ---- Not Found Errors ----
export class ProductNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Produto não encontrado', detail: 'O produto solicitado não foi encontrado.' });
  }
}

export class WarehouseNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Armazém não encontrado', detail: 'O armazém solicitado não foi encontrado.' });
  }
}

export class StoreNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Loja não encontrada', detail: 'A loja solicitada não foi encontrada.' });
  }
}

export class OrderNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Solicitação não encontrada', detail: 'A solicitação não foi encontrada.' });
  }
}

export class InvoiceNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Fatura não encontrada', detail: 'A fatura não foi encontrada.' });
  }
}

export class ClientNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Cliente não encontrado', detail: 'O cliente não foi encontrada.' });
  }
}

export class OrderProductsNotFoundError extends NotFoundError {
  constructor() {
    super({
      title: 'Produtos da solicitação não encontrados',
      detail: 'Os produtos especificados na solicitação não foram encontrados na base de dados.',
    });
  }
}

export class OrderProductItemsNotFoundError extends NotFoundError {
  constructor() {
    super({
      title: 'Itens do produto da solicitação não encontrados',
      detail: 'Os itens do produto especificados na solicitação não foram encontrados na base de dados.',
    });
  }
}

export class PrinterNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Impressora não encontrada', detail: 'A impressora solicitada não foi encontrada.' });
  }
}

// ---- Bad Request Errors ----
export class BarcodeError extends BadRequestError {
  constructor() {
    super({ title: 'Erro no código de barras', detail: 'Não foi possível identificar o GTIN do código de barras.' });
  }
}

export class InvalidProductInvoiceError extends BadRequestError {
  constructor() {
    super({ title: 'Erro produto inválido para fatura', detail: 'Um ou mais dos produtos listado não foi consumido' });
  }
}

export class RequestedReceiptOperationError extends BadRequestError {
  constructor() {
    super({ title: 'Tipo de pedido inválido - Venda direta', detail: 'O tipo da operação de consignado é inválido' });
  }
}

export class DevolutionShipmentTypeError extends BadRequestError {
  constructor() {
    super({
      title: 'Tipo de pedido inválido - Retorno',
      detail: 'O tipo da operação de consignado para devolução é inválido',
    });
  }
}

export class OrderProductsMissingError extends BadRequestError {
  constructor() {
    super({
      title: 'Produtos ausentes na solicitação',
      detail: 'A solicitação não contém os produtos necessários para a importação.',
    });
  }
}

export class OrderProductsMissingErrorV2 extends BadRequestError {
  constructor(details: string, products: string[]) {
    const response = {
      message: details,
      inexistentProducts: products,
    };

    super({
      title: 'Etiquetas inexistentes',
      detail: JSON.stringify(response),
    });
  }
}

export class OrderMissingStoreDocumentError extends BadRequestError {
  constructor() {
    super({
      title: 'Documento da loja ausente na solicitação',
      detail: 'A solicitação não contém o documento necessário da loja associada.',
    });
  }
}

export class ExistingDevolutionRequestError extends BadRequestError {
  constructor() {
    super({
      title: 'Lote já registrado',
      detail: 'O lote enviado já foi enviado para devolução',
    });
  }
}

export class OrderProductsIncorrectAmountError extends BadRequestError {
  constructor() {
    super({
      title: 'Quantidade incorreta de identificadores nos produtos',
      detail: 'Alguns produtos possuem uma quantidade de identificadores diferente da necessária para a importação.',
    });
  }
}

export class QuantityProductsError extends BadRequestError {
  constructor() {
    super({
      title: 'Quantidade de produtos inválida',
      detail: 'A quantidade de produtos informada não corresponde à quantidade existente na solicitação.',
    });
  }
}

export class ProductAvailabilityStatusError extends BadRequestError {
  constructor() {
    super({
      title: 'Status do item produto é inválido para devolução',
      detail: 'O status do produto deve ser válido para concluir a devolução.',
    });
  }
}
export class ProductAvailabilityStatusErrorV2 extends BadRequestError {
  constructor() {
    super({
      title: 'Os produtos não podem ser devolvidos!',
      detail: 'Os itens não registraram saída do(s) pedido(s) e portanto não é necessário o registro da devolução.',
    });
  }
}

export class ProductAvailabilityStatusErrorV3 extends BadRequestError {
  constructor(details: string) {
    super({
      title: 'Alguns itens não podem ser devolvidos!',
      detail: details,
    });
  }
}

/** Retorna um array products com os EPCs dos produtos */
export class ProductAvailabilityStatusErrorV4 extends BadRequestError {
  constructor(details: string, products: string[]) {
    const response = {
      message: details,
      products: products,
    };

    super({
      title: 'Alguns itens não podem ser devolvidos!',
      detail: JSON.stringify(response),
    });
  }
}

export class InvalidBatchCodeError extends BadRequestError {
  constructor() {
    super({
      title: 'Código do lote invalido',
      detail: 'O código do lote registrado no produto é inválido',
    });
  }
}

export class OrderProductsNotInElfStockError extends BadRequestError {
  constructor(details: string) {
    super({
      title: 'Produto não disponível para saída.',
      detail: details,
    });
  }
}

export class OrderProductIdentifiersMissingError extends BadRequestError {
  constructor(notFoundIdentifications: string[]) {
    super({
      title: 'Identificadores do produto não encontrados',
      detail: `Não foi possível localizar os seguintes identificadores na base de dados: ${notFoundIdentifications.join(
        ', ',
      )}`,
    });
  }
}

export class MissingBatchCodeError extends BadRequestError {
  constructor() {
    super({
      title: 'Pedido não integrado',
      detail: 'A integração do pedido não foi concluída no WMS. Aguarde e tente novamente.',
    });
  }
}

// ---- Conflict Errors ----
export class OrderCancelledError extends ConflictError {
  constructor() {
    super({ title: 'Solicitação cancelada', detail: 'A solicitação está cancelada.' });
  }
}

export class OrderAlreadyExistsError extends ConflictError {
  constructor() {
    super({ title: 'Solicitação já existente', detail: 'A solicitação já existe na base de dados.' });
  }
}

export class InvoiceAlreadyExistsError extends ConflictError {
  constructor() {
    super({ title: 'Fatura já existente', detail: 'A fatura já existe na base de dados.' });
  }
}

// ---- Service Unavailable Errors ----
export class PrinterIntegrationApiError extends ServiceUnavailableError {
  constructor({ title, detail }: { title?: string; detail?: string } = {}) {
    super({
      title: title || 'Falha ao conectar com a API de integração de impressoras',
      detail: detail || 'A API de integração de impressoras está temporariamente indisponível.',
    });
  }
}

export class PrinterLabelIntegrationApiError extends ServiceUnavailableError {
  constructor() {
    super({
      title: 'Falha ao conectar com a API de integração de impressoras',
      detail: 'A API de integração de impressoras está temporariamente indisponível.',
    });
  }
}

export class ElfaApiError extends ServiceUnavailableError {
  constructor({ title, detail }: { title?: string; detail?: string } = {}) {
    super({
      title: title || 'Falha ao conectar com a API da Elfa',
      detail: detail || 'A API da Elfa está temporariamente indisponível.',
    });
  }
}

export class ElfaApiNotFoundError extends ServiceUnavailableError {
  constructor({ title, detail }: { title?: string; detail?: string } = {}) {
    super({
      title: title || 'Erro',
      detail: detail || 'Erro',
    });
  }
}

export class ElfaApiNotFoundCodeError extends ServiceUnavailableError {
  constructor({ title, detail }: { title?: string; detail?: string } = {}) {
    super({
      title: title || 'Nota de devolução não encontrada!',
      detail: detail || 'Verifique o código digitado e tente novamente',
    });
  }
}

// ---- Unprocessable Errors ----
export class NonPreInvoicedProductItemsError extends UnprocessableError {
  constructor() {
    super({
      title: 'Itens do produto não elegíveis para pré faturamento',
      detail: 'Os itens de produto solicitados não estão em um estado adequado para faturamento antecipado.',
    });
  }
}

export class NonInvoicedProductItemsError extends UnprocessableError {
  constructor() {
    super({
      title: 'Itens do produto não elegíveis para Faturamento',
      detail: 'Os itens de produto solicitados não estão em um estado adequado para faturamento.',
    });
  }
}

export class NonCSVFileError extends UnprocessableError {
  constructor() {
    super({
      title: 'Arquivo não é um CSV',
      detail: 'O arquivo enviado não é um arquivo CSV válido.',
    });
  }
}

export class InventoryLogNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Solicitação não encontrada', detail: 'A solicitação não foi encontrada.' });
  }
}

export class FileNotFoundError extends NotFoundError {
  constructor() {
    super({ title: 'Consolidado não encontrado.', detail: 'Não há consolidados para este cliente.' });
  }
}

export class MissingParams extends BadRequestError {
  constructor() {
    super({
      title: 'Erro',
      detail: 'Pelo menos um parâmetro de pesquisa deve ser fornecido',
    });
  }
}

export class DivergenceNotFound extends NotFoundError {
  constructor() {
    super({ title: 'Divergência não encontrada.', detail: 'Não há divergências para este cliente.' });
  }
}

export class ClientDivergenceNotFoundError extends NotFoundError {
  constructor() {
    super({
      title: 'Erro',
      detail: 'O cliente associado à divergência não foi encontrado no pedido informado.',
    });
  }
}

export class OrderDivergenceNotFound extends NotFoundError {
  constructor() {
    super({
      title: 'Erro',
      detail: 'Pedido não encontrado para o cliente informado.',
    });
  }
}

export class OrderNullType extends NotFoundError {
  constructor() {
    super({
      title: 'Pedido de venda direta!',
      detail: 'O pedido informado não é consignado',
    });
  }
}

export class DevolutionNotFound extends NotFoundError {
  constructor() {
    super({
      title: 'Devolução não encontrada!',
      detail: 'Devolução não encontrada para os dados fornecidos.',
    });
  }
}

export class DevolutionDivergenceMatch extends NotFoundError {
  constructor() {
    super({
      title: 'Erro',
      detail: 'Nem todos os produtos da divergência foram encontrados na devolução fornecida.',
    });
  }
}

export class MetricsQueryParamsNotFound extends NotFoundError {
  constructor() {
    super({
      title: 'Erro',
      detail: 'Nenhum dado encontrado para os filtros aplicados.',
    });
  }
}
