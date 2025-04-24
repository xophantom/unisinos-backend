import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Invoice, ProductItem } from '../entities';
import { EProductItemStatus, GeneratePreInvoiceDto } from '../domain';
import {
  InvoiceAlreadyExistsError,
  InvoiceNotFoundError,
  NonInvoicedProductItemsError,
  NonPreInvoicedProductItemsError,
} from '../errors';
import { ElfaApiService } from './elfa-api.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(ProductItem)
    private readonly productItemRepository: Repository<ProductItem>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly elfaApiService: ElfaApiService,
  ) {}

  // ---- Public methods ----
  async generatePreInvoice(dto: GeneratePreInvoiceDto) {
    await this.ensureInvoiceDoesNotExist(dto);
    const productItemIds = await this.checkIfAllItemsAreConsumed(dto);

    await this.dataSource.transaction(async (entityManager) => {
      const savedInvoiceId = await this.saveInvoice(entityManager, dto);
      await this.updateProductItems(entityManager, productItemIds, EProductItemStatus.PRE_INVOICED, savedInvoiceId);
    });
  }

  async updateToInvoiced(saleOrderCode: number) {
    const invoice = await this.findInvoice(saleOrderCode);
    this.checkIfAllItemsArePreInvoiced(invoice);

    const productItemIds = invoice.productItems.map((item) => item.id);
    await this.dataSource.transaction(async (entityManager) => {
      await this.updateInvoiceToInvoiced(entityManager, invoice);
      await this.updateProductItems(entityManager, productItemIds, EProductItemStatus.INVOICED);
    });
  }

  async getPaymentConditions() {
    const paymentConditions = await this.elfaApiService.getElfaPaymentTerms();

    return paymentConditions;
  }

  // ---- Private methods ----
  async checkIfAllItemsAreConsumed(dto: GeneratePreInvoiceDto): Promise<number[]> {
    const productItems = await this.findProductItemsByStatus(dto.storeId, EProductItemStatus.CONSUMED);

    if (dto.productItemIds.length > 0) {
      const nonConsumedItems = dto.productItemIds.filter((id) => !productItems.some((item) => item.id === id));
      if (nonConsumedItems.length > 0) {
        throw new NonPreInvoicedProductItemsError();
      }
      return dto.productItemIds;
    }
    if (productItems.length > 0) {
      return productItems.map((item) => item.id);
    }

    throw new NonPreInvoicedProductItemsError();
  }

  private async saveInvoice(entityManager: EntityManager, body: GeneratePreInvoiceDto) {
    const { invoiceRef, saleOrderCode, returnDate, saleDate } = body;
    const entity = entityManager.create(Invoice, { invoiceRef, saleOrderCode, returnDate, saleDate });
    const savedInvoice = await entityManager.save(entity);
    return savedInvoice.id;
  }

  private async updateProductItems(
    entityManager: EntityManager,
    productItemIds: number[],
    status: EProductItemStatus,
    invoiceId?: number | null,
  ) {
    const updateData = invoiceId ? { invoice: { id: invoiceId }, status } : { status };
    await entityManager.update(ProductItem, { id: In(productItemIds) }, updateData);
  }

  private async findInvoice(saleOrderCode: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { saleOrderCode },
      relations: { productItems: true },
    });
    if (!invoice) throw new InvoiceNotFoundError();
    return invoice;
  }

  private async ensureInvoiceDoesNotExist(dto: GeneratePreInvoiceDto) {
    const alreadyExists = await this.invoiceRepository.findOne({
      where: [{ invoiceRef: dto.invoiceRef }, { saleOrderCode: dto.saleOrderCode }],
    });
    if (alreadyExists) throw new InvoiceAlreadyExistsError();
  }

  private checkIfAllItemsArePreInvoiced(invoice: Invoice) {
    const allPreInvoiced = invoice.productItems.every((item) => item.status === EProductItemStatus.PRE_INVOICED);
    if (!allPreInvoiced) throw new NonInvoicedProductItemsError();
  }

  private async findProductItemsByStatus(storeId: number, status: EProductItemStatus) {
    return this.productItemRepository.find({
      where: { movements: { order: { store: { id: storeId } } }, status },
    });
  }

  private async updateInvoiceToInvoiced(entityManager: EntityManager, invoice: Invoice) {
    await entityManager.update(Invoice, { id: invoice.id }, { isInvoiced: true });
  }
}
