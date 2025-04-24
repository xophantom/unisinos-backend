import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export const ListClientsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar os clientes',
    }),
    ApiOkResponse({
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'code', 'tradingName'],
          properties: {
            id: {
              type: 'number',
              format: 'integer',
              example: 1,
            },
            code: {
              type: 'number',
              format: 'integer',
              example: 1,
            },
            tradingName: {
              type: 'string',
              example: 'Elfa Medicamentos',
            },
          },
        },
      },
    }),
  );

export const ListClientStoresSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar as lojas de um cliente',
    }),
    ApiParam({
      name: 'clientId',
      description: 'Id do cliente',
      type: 'number',
      format: 'integer',
    }),
    ApiOkResponse({
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'code'],
          properties: {
            id: {
              type: 'number',
              format: 'integer',
              example: 1,
            },
            code: {
              type: 'number',
              format: 'integer',
              example: 1,
            },
          },
        },
      },
    }),
  );

export const ListElfaCustomerSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar Cliente Convênio Elfa',
    }),
    ApiParam({
      name: 'clientId',
      description: 'Id do cliente',
      type: 'string',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          CountryName: {
            type: 'string',
            nullable: true,
            example: 'Brazil',
          },
          CreditClass: {
            type: 'string',
            nullable: true,
            example: 'A',
          },
          CreditLimit: {
            type: 'number',
            example: 10000,
          },
          CreditLimitExpirationDate: {
            type: 'string',
            example: '2023-12-31',
          },
          DDD: {
            type: 'string',
            example: '11',
          },
          Discount: {
            type: 'number',
            example: 10.5,
          },
          Store: {
            type: 'number',
            example: 5,
          },
          District: {
            type: 'string',
            example: 'Downtown',
          },
          EcommerceEmail: {
            type: 'string',
            nullable: true,
            example: 'example@ecommerce.com',
          },
          Email: {
            type: 'string',
            example: 'example@example.com',
          },
          FreightType: {
            type: 'string',
            nullable: true,
            example: 'Express',
          },
          Group: {
            type: 'string',
            example: 'Group A',
          },
          GroupDescription: {
            type: 'string',
            nullable: true,
            example: 'Description of Group A',
          },
          HomePage: {
            type: 'string',
            nullable: true,
            example: 'http://example.com',
          },
          InscricaoEstadual: {
            type: 'string',
            example: '123456789',
          },
          InscricaoMunicipal: {
            type: 'string',
            nullable: true,
            example: '987654321',
          },
          IssueBoleto: {
            type: 'boolean',
            example: true,
          },
          KeyAccount: {
            type: 'boolean',
            example: false,
          },
          LegalEntityType: {
            type: 'string',
            example: 'Company',
          },
          Name: {
            type: 'string',
            example: 'John Doe',
          },
          Notes: {
            type: 'string',
            nullable: true,
            example: 'Additional notes',
          },
          PaymentTermCode: {
            type: 'string',
            example: '30D',
          },
          PaymentTermDescription: {
            type: 'string',
            example: 'Net 30 Days',
          },
          PaymentTermType: {
            type: 'string',
            example: 'Standard',
          },
          Phone: {
            type: 'string',
            example: '+5511999999999',
          },
          PriceList: {
            type: 'string',
            example: 'Price List 1',
          },
          ProtheusCreationDate: {
            type: 'string',
            example: '2023-01-01',
          },
          Region: {
            type: 'string',
            nullable: true,
            example: 'South',
          },
          Risk: {
            type: 'string',
            nullable: true,
            example: 'Low',
          },
          SalesGroup: {
            type: 'string',
            nullable: true,
            example: 'Sales Group A',
          },
          Segment: {
            type: 'string',
            example: 'Retail',
          },
          SegmentDescription: {
            type: 'string',
            example: 'Retail Segment',
          },
          ShortName: {
            type: 'string',
            example: 'JD',
          },
          Type: {
            type: 'string',
            example: 'Customer',
          },
          UF: {
            type: 'string',
            example: 'SP',
          },
          UPSERTED_AT: {
            type: 'string',
            example: '2023-01-01T12:00:00Z',
          },
          WMSRoute: {
            type: 'string',
            nullable: true,
            example: 'Route 1',
          },
          Warehouse: {
            type: 'string',
            nullable: true,
            example: 'Warehouse A',
          },
          CustomSegment: {
            type: 'string',
            example: 'Custom Segment A',
          },
        },
      },
    }),
  );
