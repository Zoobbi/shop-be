import {getProductsList} from "@functions/getProductsList/handler";
import {mockData} from "@libs/getProductsFromMock";

describe('getProductList', () => {
    it('should return list', async () => {
        const res = await getProductsList();

        expect(res).toEqual({
            body: JSON.stringify({products: mockData}),
            statusCode: 200
        })
    })
})
