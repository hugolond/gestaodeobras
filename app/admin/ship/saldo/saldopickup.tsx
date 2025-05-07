export interface SaldoPickup {
  data: Data
}

export interface Data {
  productHistory: ProductHistory
}

export interface ProductHistory {
  skuName: string
  catalogProduct: CatalogProduct
  sku: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  changelogHistory: ChangelogHistory[]
}

export interface CatalogProduct {
  name: string
}

export interface ChangelogHistory {
  user: string
  quantityBefore: number
  quantityAfter: number
  date: string
}
