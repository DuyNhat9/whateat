import React from "react";
import "./TopShop.css";
import ShopCard from "../ShopCard/ShopCard";

const TopShops = () => {
  return (
    <div className="top-shop-container">
      <div className="top-shop">
        <h1 className="title">Khám phá thêm</h1>
        <div className="shop-card-container">
          {mock_data.map((item, idx) => {
            return <ShopCard key={idx} {...item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default TopShops;

const mock_data = [
  {
    storeId: 1,
    shopName: "TOPMEAL",
    avtUrl:
      "https://salt.tikicdn.com/cache/200x200/ts/seller/b6/a2/73/128c9ce382796619e360d14814d649c6.jpg.webp",
    ratingAvg: 4.5,
    totalRate: 965,
    products: [
      {
        productId: 1,
        name: "Thịt Đùi Heo (Thịt Tươi)",
        basePrice: 44000,
        weightServing: "300g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/13836/s/3f1c9b5f-7c64-4d65-90e3-86dbe5c592f6.jpeg",
            },
          ],
        ],
      },
      {
        productId: 2,
        name: "Vịt Kho Gừng (Ướp Sẵn)",
        basePrice: 45000,
        weightServing: "300g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/10429/s/64c714d6-590c-46d7-9a12-387070703b78.jpeg",
            },
          ],
        ],
      },
      {
        productId: 3,
        name: "Thịt Vịt Xiêm (Chặt Sẵn)",
        basePrice: 42000,
        weightServing: "300g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/14278/s/ac103153-4949-4074-b184-b3a2c21ad681.jpeg",
            },
          ],
        ],
      },
    ],
  },
  {
    storeId: 2,
    shopName: "Đảo Hải Sản",
    avtUrl:
      "	https://salt.tikicdn.com/cache/200x200/ts/seller/9c/7c/b8/1cdfebaa1ee1ed7f861dcbd407e30a78.jpg.webp",
    ratingAvg: 4.7,
    totalRate: 3800,
    products: [
      {
        productId: 1,
        name: "Mực Lá Làm Sạch",
        basePrice: 79000,
        weightServing: "200-220g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/4486/s/067d587c-40a1-42c6-95f4-a86147f919a0.jpeg",
            },
          ],
        ],
      },
      {
        productId: 2,
        name: "Mực Ống Tươi - Loại Vừa",
        basePrice: 135000,
        weightServing: "400-450g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/8534/s/a7d323b8-f0da-4ebb-8c4d-ccaf5c6b18b1.jpeg",
            },
          ],
        ],
      },
      {
        productId: 3,
        name: "Mực Dẻo 2 Nắng",
        basePrice: 230000,
        weightServing: "500-550g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/15487/s/eadd1af5-8404-4e26-bb80-7ad0e5b7345e.jpeg",
            },
          ],
        ],
      },
    ],
  },
  {
    storeId: 3,
    shopName: "Hải Sản Đại Dương Xanh",
    avtUrl:
      "https://salt.tikicdn.com/cache/200x200/ts/seller/d8/d5/cc/4f04fa2a292b7d2e1145e7d2258e3112.png.webp",
    ratingAvg: 4.8,
    totalRate: 20,
    products: [
      {
        productId: 1,
        name: "Mực Nang Làm Sạch",
        basePrice: 69000,
        weightServing: "200g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/17360/s/e32e7fd8-47e1-46b1-b783-06e4505e4735.jpeg",
            },
          ],
        ],
      },
      {
        productId: 2,
        name: "Canh Tôm Thẻ Tươi Nấu Khoai Mỡ",
        basePrice: 52000,
        weightServing: "2 người",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/147/s/19057b6f-a303-4a81-b4f9-ad1de2b357e0.jpeg",
            },
          ],
        ],
      },
      {
        productId: 3,
        name: "Canh Cua Mồng Tơi, Mướp Hương",
        basePrice: 47000,
        weightServing: "2 người",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/5818/s/cb53b84d-204b-48a9-b51d-a16794feb447.jpeg",
            },
          ],
        ],
      },
    ],
  },
  {
    storeId: 4,
    shopName: "Grove Fresh",
    avtUrl:
      "https://salt.tikicdn.com/cache/200x200/ts/seller/3f/96/d5/e81c134abc998bb05c88bacc89945151.jpg.webp",
    ratingAvg: 4.8,
    totalRate: 1200,
    products: [
      {
        productId: 1,
        name: "Dừa xiêm bến tre",
        basePrice: 22000,
        weightServing: "1 trái",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/2853/s/04c1974d-ef9c-46a1-a280-b99379ac3839.jpeg",
            },
          ],
        ],
      },
      {
        productId: 2,
        name: "Cóc non",
        basePrice: 22000,
        weightServing: "500g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/3783/s/b319eaf1-dcd9-42ef-a067-6240f62beb08.jpeg",
            },
          ],
        ],
      },
      {
        productId: 3,
        name: "Xoài keo",
        basePrice: 27000,
        weightServing: "1.1 - 1.3kg",
        images: [
          [
            {
              url: "	https://image.cooky.vn/posproduct/g0/3112/s/c64137df-6bd2-4400-b042-ac88b8157a60.jpeg",
            },
          ],
        ],
      },
    ],
  },
  {
    storeId: 5,
    shopName: "Tiệm bánh Mr Bee",
    avtUrl:
      "https://salt.tikicdn.com/cache/200x200/ts/seller/d4/a1/78/1bac4b074e1feb52ffd7ec70cd2def47.jpg.webp",
    ratingAvg: 4.7,
    totalRate: 527,
    products: [
      {
        productId: 1,
        name: "Bánh Mandu Nhân Hải Sản Bibigo",
        basePrice: 68000,
        weightServing: "350g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/9148/s/4b75e72f-89ff-4f02-b566-c22482c6ddcd.jpeg",
            },
          ],
        ],
      },
      {
        productId: 2,
        name: "Bánh Tráng Vuông Lớn Mikiri",
        basePrice: 23000,
        weightServing: "70 Cái",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/9707/s/faed50c7-a5ea-4916-bb76-876ec5fc43df.jpeg",
            },
          ],
        ],
      },
      {
        productId: 3,
        name: "Bánh Mì 5 Sao Vbread",
        basePrice: 37000,
        weightServing: "5x60g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/14287/s/bb8f8387-22ce-4ba9-83e2-7da963223282.jpeg",
            },
          ],
        ],
      },
    ],
  },
  {
    storeId: 6,
    shopName: "NÔNG TRẠI NGỌT NGÀO",
    avtUrl:
      "https://salt.tikicdn.com/cache/200x200/ts/seller/4b/54/1a/f385a79a716cb3505f152e7af8c769aa.png.webp",
    ratingAvg: 4.8,
    totalRate: 140,
    products: [
      {
        productId: 1,
        name: "Nho Xanh Phan Rang",
        basePrice: 43000,
        weightServing: "500g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/4349/s/9839d968-d7cc-4855-adc9-4c64bd1d1a33.jpeg",
            },
          ],
        ],
      },
      {
        productId: 2,
        name: "Táo Ambrosia Canada",
        basePrice: 76000,
        weightServing: "500-600g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/15892/s/4d2b004d-b2b6-49a1-93c0-595029b4fcc5.jpeg",
            },
          ],
        ],
      },
      {
        productId: 3,
        name: "Thơm (Dứa) Long An Cắt Sẵn",
        basePrice: 15000,
        weightServing: "300g",
        images: [
          [
            {
              url: "https://image.cooky.vn/posproduct/g0/4356/s/70ac8f67-d55f-4be7-b698-52e3cf3252ee.jpeg",
            },
          ],
        ],
      },
    ],
  },
];
