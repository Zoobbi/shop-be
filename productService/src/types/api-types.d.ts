export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
}


export interface Products{
    products: Array<Product>
}
