import {Product} from "../types/api-types";

interface IItem extends Product {
    count: number;
}

export const mockData: Array<IItem> = [
    { id: "1", title: "Red Roses", description: "A bouquet of 12 red roses", price: 20, count: 3 },
    { id: '2', title: 'White Lilies', description: 'A bunch of 5 white lilies', price: 15, count: 0 },
    { id: '3', title: 'Pink Carnations', description: 'A bouquet of 10 pink carnations', price: 12, count: 2 },
    { id: '4', title: 'Purple Orchids', description: 'A bunch of 3 purple orchids', price: 25, count: 1 },
    { id: '5', title: 'Sunflowers', description: 'A bouquet of 6 sunflowers', price: 18, count: 4 },
    { id: '6', title: 'Mixed Flowers', description: 'A mix of 8 different flowers', price: 30, count: 5 },
];


export const getProductsFromMock = async (): Promise<Array<Product>> => {
    return mockData;
}
