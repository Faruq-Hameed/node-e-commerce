const users = [{
    userId:'u1',
    name: 'admin',
    email: 'admin@example.com',
    userName: 'admin',
    password:'random',
    walletBalance: 100,
    status: true,
    dateSignedUp: new Date()

},
{
    userId:'u2',
    name: 'adeshina',
    email: 'adeshina@example.com',
    userName: 'adeshina02',
    password:'adeshina2',
    walletBalance: 100,
    status: true,
    dateSignedUp: new Date()

},
{
    userId:'u1',
    name: 'faruq',
    email: 'faruq@example.com',
    userName: 'faruq01',
    password:'random01',
    walletBalance: 100,
    status: true,
    dateSignedUp: new Date()

},

]

const products = [
    {
        productId: 'p1',
        productName: 'Orange',
        productQty: 20,
        pricePerUnit: 30,
        soldQty:0
    },
    {
        productId: 'p2',
        productName: 'Cherry',
        productQty: 20,
        pricePerUnit: 20,
        soldQty:0
    },
    {
        productId: 'p3',
        productName: 'Grape',
        productQty: 20,
        pricePerUnit: 12,
        soldQty:0
    },
    {
        productId: 'p4',
        productName: 'Guava',
        productQty: 20,
        pricePerUnit: 10,
        soldQty:0
    },
    {
        productId: 'p5',
        productName: 'Pawpaw',
        productQty: 20,
        pricePerUnit: 19,
        soldQty:0
    },
    {
        productId: 'p6',
        productName: 'Banana',
        productQty: 20,
        pricePerUnit: 15,
        soldQty:0
    },
    
]


module.exports = {products, users}

// const currentOrders = [
//     {
//         userId:001,
//         userOrders: {
//             order1:{
//                 productId: 'p1',
//                 totalQty,
//                 qtyValue:k
//             }

           
//         }   
//     }
// ]