import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { mockData } from "@libs/getProductsFromMock";
import { v1 as uuidv1 } from 'uuid';

const ProductTableName = 'products';
const StocksTableName = 'stocks';
const REGION = "us-east-1";

console.log(ProductTableName, StocksTableName)

const client = new DynamoDBClient({ region: REGION });

const items = [[],[]];

 mockData?.forEach((item) =>  {
     const id = uuidv1();

    items[0].push({
        PutRequest: {
            Item: {
                "id": { S: id},
                "title": { S: item.title },
                "description": { S: item.description },
                "price": { N: item.price.toString() },
            }
        }
    });

     items[1].push({
         PutRequest: {
             Item: {
                 "product_id": { S: id},
                 "count": { N: item.count.toString() },
             }
         }
     });
});

const putItems = async () => {
    const paramsProducts = {
        RequestItems: {
            [ProductTableName]: items[0]
        },
    };

    const paramsStock = {
        RequestItems: {
            [StocksTableName]: items[1]
        },
    };

    try {
        const products = await client.send(new BatchWriteItemCommand(paramsProducts));
        const stocks = await client.send(new BatchWriteItemCommand(paramsStock));
        console.log("Data products inserted:", products);
        console.log("Data stocks inserted:", stocks);
    } catch (err) {
        console.error(err);
    }
};

putItems();

//    "count": { N: item.count.toString() },
