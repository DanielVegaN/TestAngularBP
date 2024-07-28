export interface Product{
  id: string;
  name: string;
  logo: string;
  description: string;
  date_release: string;
  date_revision: string;
}

export interface ProductResponse{
  message?: string;
  name?: string;
  data: Product[];
}

export interface ProductResponseCU{
  message?: string;
  name?: string;
  data: Product;
}
