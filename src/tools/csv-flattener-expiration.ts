/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const flattenExpirationMetricsData = (
  items: any[],
  classifyFn: (item: any) => 'Prazo' | 'Alerta' | 'Vencido',
): any[] => {
  return items.map((item) => {
    const formatDocument = (doc: string): string => {
      const cleaned = doc.replace(/\D/g, '');
      if (cleaned.length === 14) {
        return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      } else if (cleaned.length === 11) {
        return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      }
      return doc;
    };

    const now = new Date();
    const expirationDate = new Date(item.expiresAt);
    const diffDays = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    let newClassification = '';
    if (diffDays > 90) {
      newClassification = 'Prazo';
    } else if (diffDays <= 0) {
      newClassification = 'Vencido';
    } else {
      newClassification = 'Alerta';
    }

    return {
      armazemCNPJ: item.armazemCNPJ ? formatDocument(String(item.armazemCNPJ)) : '',
      armazemNome: item.armazemNome || '',
      storeDocument: item.storeDocument ? formatDocument(String(item.storeDocument)) : '',
      storeName: item.storeName || '',
      clientCode: item.clientCode ? String(item.clientCode) : '',
      storeCode: item.storeCode ? String(item.storeCode) : '',
      productCode: item.productCode ? String(item.productCode) : '',
      productDescription: item.productDescription || '',
      epc: item.epc || '',
      lot: item.lot || '',
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('pt-BR') : '',
      unitCost: item.unitCost || 0,
      rfidStatus: item.status || '',
      status: item.status || '',
      expiration: newClassification,
      address: item.storeAddress || '',
    };
  });
};
