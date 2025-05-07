export default interface PedidoPdv {
    companyNumber: string
    storeNumber: string
    operatorCode: string
    orderNumber: number
    status: string
    originSystem: string
    customer: Customer
    fiscalItems: FiscalItem[]
    orderPayments: OrderPayment[]
    orderDate: string
    totalValue: number
    discounts: Discount2[]
  }
  
  export interface Customer {
    customerId: string
    name: string
    document: string
    documentType: string
    address: Address
    customerType: string
    email: string
  }
  
  export interface Address {
    addressName: string
    addressNumber: string
    addressComplement: string
    city: string
    state: string
    country: string
    zipCode: string
    neighborhood: string
    phone: string
  }
  
  export interface FiscalItem {
    sequenceId: number
    productCode: string
    automationCode: string
    productDescription: string
    productCompactDescription: string
    deliveryOption: string
    unitValue: number
    quantitySold: number
    totalValue: number
    unitQuantity: number
    saleUnit: string
    materialOrigin: string
    cbModality: number
    discounts: Discount[]
    externalSequenceId: string
  }
  
  export interface Discount {
    sequenceId: number
    value: number
    type: string
    source: string
  }
  
  export interface OrderPayment {
    paymentSequence: string
    paymentCodeMethod: string
    paymentCodePlan: string
    paymentValue: number
    numberOfInstallments: number
    mandatoryMethod: boolean
    paymentMethodIndicator: number
    integrationType: number
  }
  
  export interface Discount2 {
    sequenceId: number
    value: number
    type: string
    source: string
  }