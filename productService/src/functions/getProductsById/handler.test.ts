import {getProductsById} from "@functions/getProductsById/handler";

describe("getProductsById", () => {
    it("returns the expected product when given a valid productId", async () => {
        const productId = "1";
        const event = { pathParameters: { productId } };

        const response = await getProductsById(event);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toContain(`"id":"${productId}"`);
    });
});

