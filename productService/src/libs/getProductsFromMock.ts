import {Product} from "../types/api-types";

export const mockData: Array<Product> = [
    {
        "id": "1",
        "title": "Car",
        "description": "Fast car",
        "price": 12223.1
    },
    {
        "id": "2",
        "title": "Moto",
        "description": "Slow Moto",
        "price": 1234.2
    },
    {
        "id": "3",
        "title": "Legs",
        "description": "Best Legs",
        "price": 1322.3
    }
]


export const getProductsFromMock = () => {
    return mockData;
}
