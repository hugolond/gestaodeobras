export interface Cliente {
    elements: Element[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    numberOfElements: number
  }
  
  export interface Element {
    id: number
    dataNascimento: string
    email: string
    nomeCompleto: string
    cpf: string
    celular: string
    isPrime: boolean
    isFuncionario: boolean
    isVendaTablet: boolean
    genero: number
    dataCriacao: string
    dataAtualizacao: string
    dataUltimoLogin: string
    ativo: boolean
    whatsAppOption: boolean
    enderecos: Endereco[]
  }
  
  export interface Endereco {
    id: number
    tipo: string
    logradouro: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    numero: string
    complemento: string
    referencia: any
    nomeRecebedor: any
    defaultBilling: boolean
    defaultShipping: boolean
    ativo: boolean
  }
  