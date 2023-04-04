import {getProductsList} from "@functions/getProductsList/handler";

describe('getProductList', () => {
    it('should return list', async () => {
        const res = await getProductsList();

        expect(res).toEqual('ds')
    })
})
