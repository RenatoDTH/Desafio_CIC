export interface ICreateBooksRequest {
  name: string;
  email: string;
  filename: string;
  mimetype: string;
}

export interface ISubmitOneBookRequest extends ICreateBooksRequest {
  price: number;
}

export interface ICreateBookResponse {
  success: boolean;
  message: string;
}

export interface IIndexRequest {
  publisher?: string;
  publicationDate?: string;
  title?: string;
  priceOrder?: boolean;
  publicationDateOrder?: boolean;
}

export interface IIndexResponse {
  id: string;
  title: string;
  authors: string;
  numPages: number;
  publicationDate: string;
  publisher: string;
  price: number;
  seller: string;
  sellerId: string;
  updated_at: string;
  created_at: string;
}

export interface IBuyResponse {
  success: boolean;
  title: string;
  authors: string;
  price: number;
  seller: string;
}

export interface IBuyNoResponse {
  success: boolean;
  message: string;
}

export interface ISubmitByPdfNoResponse {
  success: boolean;
  message: string;
}

export interface ISubmitByPdfResponse {
  success: boolean;
  dataToBeSaved: {
    seller: string;
    sellerId: string;
    price: number;
    numPages: number;
    title: string;
    authors: string;
    publicationDate: string;
    publisher: string;
  };
}
