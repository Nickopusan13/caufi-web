export const userProfile = {
  fullName: "Muhammad Nickopusan Guntara",
  username: "nickopusan1313",
  gender: "Male",
  birthday: "2002-10-13",
  email: "nickoguntara123@gmail.com",
  phoneNumber: "085156229898",
  addresses: [
    {
      label: "Home",
      recipientName: "Muhammad Nickopusan Guntara",
      street: "Jalan Venus Angkasa",
      city: "Jakarta",
      state: "JKT",
      postalCode: "13620",
      country: "ID",
      isDefault: true,
    },
    {
      label: "Office",
      recipientName: "Muhammad Nickopusan Guntara",
      street: "Jl. Sudirman No. 45",
      city: "Jakarta",
      state: "JKT",
      postalCode: "10210",
      country: "ID",
      isDefault: false,
    },
  ],
  orderHistory: [
    {
      orderId: "ORD-06E25928",
      date: "2025-08-10",
      status: "Delivered",
      products: [
        {
          name: "Red Sneakers",
          image: "/assets/Clothes.png",
          price: 500000,
          quantity: 2,
        },
      ],
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: 10001,
        country: "USA",
      },
    },
    {
      orderId: "ORD-F0B4B526 ",
      date: "2025-08-12",
      total: 12000000,
      status: "Shipped",
      products: [
        {
          name: "Red Sneakers",
          image: "/assets/Clothes.png",
          price: 500000,
          quantity: 2,
        },
        {
          name: "Blue T-shirt",
          image: "/assets/Clothes2.png",
          price: 500000,
          quantity: 2,
        },
        {
          name: "Blue T-shirt",
          image: "/assets/Clothes2.png",
          price: 500000,
          quantity: 2,
        },
      ],
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: 10001,
        country: "USA",
      },
    },
  ],
  settings: {
    newsletterSubscribed: true,
    twoFactorAuthEnabled: false,
  },
};
