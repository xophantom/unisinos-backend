/* eslint-disable @typescript-eslint/no-explicit-any */
export const flattenMetricsData = (data: any): any[] => {
  const flattened: any[] = [];

  if (data.Orange && data.Orange.length > 0) {
    data.Orange.forEach((item: any) => {
      flattened.push({
        Section: 'Orange',
        Label: item.label,
        Value: item.value,
      });
    });
  }

  if (data.Blue && data.Blue.length > 0) {
    data.Blue.forEach((item: any) => {
      flattened.push({
        Section: 'Blue',
        Label: item.label,
        Value: item.value,
      });
    });
  }

  if (data.Green && data.Green.length > 0) {
    data.Green.forEach((item: any) => {
      flattened.push({
        Section: 'Green',
        Label: item.label,
        Value: item.value,
      });
    });
  }

  if (data.Branch && data.Branch.length > 0) {
    data.Branch.forEach((branch: any) => {
      if (branch.armazemCodigo || branch.armazemNome) {
        flattened.push({
          Section: 'Branch',
          ArmazemCodigo: branch.armazemCodigo || '',
          ArmazemNome: branch.armazemNome || '',
          ValorEstoqueCliente: branch.valorEstoqueCliente || 0,
          QuantidadeEstoqueCliente: branch.quantidadeEstoqueCliente || 0,
          Porcentagem: branch.porcentagem || 0,
        });
      }
    });
  }

  if (data.Seller && data.Seller.length > 0) {
    data.Seller.forEach((seller: any) => {
      if (seller.representante) {
        flattened.push({
          Section: 'Seller',
          Representante: seller.representante || '',
          QuantidadeFaturas: seller.quantidadeFaturas || 0,
          QuantidadeClientes: seller.quantidadeClientes || 0,
          ValorTotalPedidos: seller.valorTotalPedidos || 0,
          TicketMedio: seller.ticketMedio || 0,
        });
      }
    });
  }

  if (data.Analytical && data.Analytical.length > 0) {
    data.Analytical.forEach((item: any) => {
      if (item.codigo && item.descricao && item.armazemNome && item.lote) {
        flattened.push({
          Section: 'Analytical',
          Codigo: item.codigo || '',
          Descricao: item.descricao || '',
          ArmazemNome: item.armazemNome || '',
          Lote: item.lote || '',
          DataValidade: item.dataValidade ? new Date(item.dataValidade).toISOString().split('T')[0] : '',
          ValorUnitario: item.valorUnitario || 0,
          Quantidade: item.quantidade || 0,
          ValorTotal: item.valorTotal || 0,
        });
      }
    });
  }

  return flattened;
};
