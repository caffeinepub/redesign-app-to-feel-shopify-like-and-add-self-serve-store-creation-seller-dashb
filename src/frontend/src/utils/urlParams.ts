export function getSupplierIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('supplier');
}

export function setSupplierIdInUrl(supplierId: string | null) {
  const url = new URL(window.location.href);
  if (supplierId) {
    url.searchParams.set('supplier', supplierId);
  } else {
    url.searchParams.delete('supplier');
  }
  window.history.pushState({}, '', url.toString());
}

export function clearSupplierFilter() {
  setSupplierIdInUrl(null);
}

export function getSecretParameter(key: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}
