const Stakeholder = artifacts.require("Stakeholder");
const CentralGov = artifacts.require("CentralGov");
const StateGov = artifacts.require("StateGov");
const Product = artifacts.require("Product");
const Main = artifacts.require("Main");

module.exports = async (callback) => {

  const accounts = await web3.eth.getAccounts();

  let stakeholderContract = await Stakeholder.deployed();
  let centralGovContract = await CentralGov.deployed();
  let stateGovContract = await StateGov.deployed();
  let productContract = await Product.deployed();
  let mainContract = await Main.deployed(centralGovContract.address, stateGovContract.address, stakeholderContract.address);

  const admin = accounts[0];
  const centralGov1 = accounts[1];
  const centralGov2 = accounts[2];
  const stateGov1 = accounts[3];
  const stateGov2 = accounts[4];
  const distributer = accounts[5];
  const retailer1 = accounts[6];
  const retailer2 = accounts[7];
  const consumer1 = accounts[8];
  const consumer2 = accounts[9];

  await stakeholderContract.register("Admin", "Internet", "admin", { from: admin });
  await centralGovContract.registerCentralGov("CentralGov 1", "West India", "centralGov", ["Milk", "Cocoa", "Sugar", "Apple", "Banana"], { from: centralGov1 });
  await centralGovContract.registerCentralGov("CentralGov 2", "North India", "centralGov", ["Rice", "Cocoa", "Wheat", "Tomato", "Sugar"], { from: centralGov2 });
  await stateGovContract.register("Cadbury", "Uxbridge, United Kingdom", "stateGov", { from: stateGov1 });
  await stateGovContract.register("Nestle", "Vevey, Switzerland", "stateGov", { from: stateGov2 });
  await stakeholderContract.register("Distributer", "New Delhi, India", "distributer", { from: distributer });
  await stakeholderContract.register("Big Mart", "Greater Noida, India", "retailer", { from: retailer1 });
  await stakeholderContract.register("Annapurna", "Greater Noida, India", "retailer", { from: retailer2 });
  await stakeholderContract.register("Mohan", "Greater Noida, India", "consumer", { from: consumer1 });
  await stakeholderContract.register("Sohan", "Greater Noida, India", "consumer", { from: consumer2 });

  console.log(await centralGovContract.getCentralGov(centralGov1, { from: centralGov1 }));
  console.log(await centralGovContract.getCentralGov(centralGov2, { from: centralGov2 }));
  console.log(await stateGovContract.get(stateGov1, { from: stateGov1 }));
  console.log(await stateGovContract.get(stateGov2, { from: stateGov2 }));
  console.log(await stakeholderContract.get(distributer, { from: distributer }));
  console.log(await stakeholderContract.get(retailer1, { from: retailer1 }));
  console.log(await stakeholderContract.get(retailer2, { from: retailer2 }));
  console.log(await stakeholderContract.get(consumer1, { from: consumer1 }));
  console.log(await stakeholderContract.get(consumer2, { from: consumer2 }));
  console.log(await centralGovContract.getRawProductCentralGovs("Cocoa", { from: centralGov1 }));
  
  await centralGovContract.verify(centralGov2, { from: admin });
  console.log(await centralGovContract.isVerified(centralGov2, { from: centralGov2 }));

  //1st stateGov
  await stateGovContract.addRawProduct("Cocoa", [
    {
      id: centralGov1,
      isVerified: await centralGovContract.isVerified(centralGov1, { from: centralGov1 })
    },
    {
      id: centralGov2,
      isVerified: await centralGovContract.isVerified(centralGov2, { from: centralGov2 })
    }
  ], { from: stateGov1 });
  await stateGovContract.addRawProduct("Milk", [
    {
      id: centralGov1,
      isVerified: await centralGovContract.isVerified(centralGov1, { from: centralGov1 })
    },
  ], { from: stateGov1 });
  await stateGovContract.addRawProduct("Wheat", [
    {
      id: centralGov2,
      isVerified: await centralGovContract.isVerified(centralGov2, { from: centralGov2 })
    },
  ], { from: stateGov1 });
  await stateGovContract.addRawProduct("Sugar", [
    {
      id: centralGov1,
      isVerified: await centralGovContract.isVerified(centralGov1, { from: centralGov1 })
    },
    {
      id: centralGov2,
      isVerified: await centralGovContract.isVerified(centralGov2, { from: centralGov2 })
    }
  ], { from: stateGov1 });
  await stateGovContract.addRawProduct("Banana", [
    {
      id: centralGov1,
      isVerified: await centralGovContract.isVerified(centralGov1, { from: centralGov1 })
    },
  ], { from: stateGov1 });

  //2nd StateGov
  await stateGovContract.addRawProduct("Cocoa", [
    {
      id: centralGov2,
      isVerified: await centralGovContract.isVerified(centralGov2, { from: centralGov2 })
    },
  ], { from: stateGov2 });
  await stateGovContract.addRawProduct("Apple", [
    {
      id: centralGov1,
      isVerified: await centralGovContract.isVerified(centralGov1, { from: centralGov1 })
    },
  ], { from: stateGov2 });
  await stateGovContract.addRawProduct("Rice", [
    {
      id: centralGov2,
      isVerified: await centralGovContract.isVerified(centralGov2, { from: centralGov2 })
    },
  ], { from: stateGov2 });
  await stateGovContract.addRawProduct("Tomato", [
    {
      id: centralGov2,
      isVerified: await centralGovContract.isVerified(centralGov2, { from: centralGov2 })
    },
  ], { from: stateGov2 });

  //StateGov1 Launch Product
  let stateGov1RawProducts = await stateGovContract.getStateGovRawProductDetails(stateGov1, { from: stateGov1 });
  stateGov1RawProductsMap = {};
  for (let i = 0; i < stateGov1RawProducts.length; i++) {
    stateGov1RawProductsMap[stateGov1RawProducts[i].name] = stateGov1RawProducts[i].isVerified;
  }
  console.log(stateGov1RawProductsMap);

  console.log(await stateGovContract.getStateGov(stateGov1, {from : admin}));

  await productContract.add(
    12091, 
    "Dairy Milk", 
    [
      {
        name: "Milk",
        isVerified: stateGov1RawProductsMap["Milk"]
      },
      {
        name: "Sugar",
        isVerified: stateGov1RawProductsMap["Sugar"]
      },
      {
        name: "Wheat",
        isVerified: stateGov1RawProductsMap["Wheat"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423804/Supply%20Chain/Product%20images/dairy_milk_cadbury_k5ihc3.jpg",
    {from: stateGov1}
  );
  await stateGovContract.launchProduct(12091, {from: stateGov1});

  await productContract.add(
    12092, 
    "5 Star Chocolate", 
    [
      {
        name: "Milk",
        isVerified: stateGov1RawProductsMap["Milk"]
      },
      {
        name: "Sugar",
        isVerified: stateGov1RawProductsMap["Sugar"]
      },
      {
        name: "Wheat",
        isVerified: stateGov1RawProductsMap["Wheat"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423804/Supply%20Chain/Product%20images/5star_cadbury_emfynn.webp",
    {from: stateGov1}
  );
  await stateGovContract.launchProduct(12092, {from: stateGov1});

  await productContract.add(
    12093, 
    "Banana Cake", 
    [
      {
        name: "Milk",
        isVerified: stateGov1RawProductsMap["Milk"]
      },
      {
        name: "Sugar",
        isVerified: stateGov1RawProductsMap["Sugar"]
      },
      {
        name: "Wheat",
        isVerified: stateGov1RawProductsMap["Wheat"]
      },
      {
        name: "Banana",
        isVerified: stateGov1RawProductsMap["Banana"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423804/Supply%20Chain/Product%20images/cake_cadbury_tw16tw.jpg",
    {from: stateGov1}
  );
  await stateGovContract.launchProduct(12093, {from: stateGov1});

  //StateGov2 Launch Product

  let stateGov2RawProducts = await stateGovContract.getStateGovRawProductDetails(stateGov2, { from: stateGov2 });
  stateGov2RawProductsMap = {};
  for (let i = 0; i < stateGov2RawProducts.length; i++) {
    stateGov2RawProductsMap[stateGov2RawProducts[i].name] = stateGov2RawProducts[i].isVerified;
  }
  console.log(stateGov2RawProductsMap);

  console.log(await stateGovContract.getStateGov(stateGov2, {from : admin}));

  await productContract.add(
    22091, 
    "Munch Chocolate", 
    [
      {
        name: "Cocoa",
        isVerified: stateGov2RawProductsMap["Milk"]
      },
      {
        name: "Sugar",
        isVerified: stateGov2RawProductsMap["Sugar"]
      },
      {
        name: "Wheat",
        isVerified: stateGov2RawProductsMap["Wheat"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423805/Supply%20Chain/Product%20images/munch_nestle_lrjcal.jpg",
    {from: stateGov2}
  );
  await stateGovContract.launchProduct(22091, {from: stateGov2});

  await productContract.add(
    22092, 
    "Tomato Sauce", 
    [
      {
        name: "Tomato",
        isVerified: stateGov2RawProductsMap["Tomato"]
      },
      {
        name: "Sugar",
        isVerified: stateGov2RawProductsMap["Sugar"]
      },
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423805/Supply%20Chain/Product%20images/tomato_sauce_nestle_w1vsqg.jpg",
    {from: stateGov2}
  );
  await stateGovContract.launchProduct(22092, {from: stateGov2});


  await productContract.transfer(distributer, 12091, {from: stateGov1});
  await productContract.addReview(12091, 70, "Good product", {from: distributer});
  await productContract.transfer(retailer1, 12091, {from: distributer});
  await productContract.addReview(12091, 90, "Value for money", {from: retailer1});
  await productContract.transfer(consumer1, 12091, {from: retailer1});
  await productContract.addReview(12091, 60, "Useful", {from: consumer1});
  console.log(await productContract.get(12091, {from: consumer1}));

  await productContract.transfer(distributer, 12092, {from: stateGov1});
  await productContract.addReview(12092, 80, "Good product", {from: distributer});
  await productContract.transfer(retailer1, 12092, {from: distributer});
  await productContract.addReview(12092, 90, "Value for money", {from: retailer1});
  await productContract.transfer(consumer2, 12092, {from: retailer1});
  await productContract.addReview(12092, 100, "Good taste", {from: consumer2});
  console.log(await productContract.get(12092, {from: consumer2}));

  await productContract.transfer(distributer, 12093, {from: stateGov1});
  await productContract.addReview(12093, 70, "Good product", {from: distributer});
  console.log(await productContract.get(12093, {from: consumer1}));

  await productContract.transfer(distributer, 22091, {from: stateGov2});
  await productContract.addReview(22091, 70, "Good product", {from: distributer});
  await productContract.transfer(retailer2, 22091, {from: distributer});
  await productContract.addReview(22091, 90, "Value for money", {from: retailer2});
  await productContract.transfer(consumer2, 22091, {from: retailer2});
  await productContract.addReview(22091, 60, "Useful", {from: consumer2});
  console.log(await productContract.get(22091, {from: consumer2}));

  await productContract.transfer(distributer, 22092, {from: stateGov2});
  await productContract.addReview(22092, 40, "Too Expensive", {from: distributer});
  await productContract.transfer(retailer2, 22092, {from: distributer});
  await productContract.addReview(22092, 90, "Tasty", {from: retailer2});
  await productContract.transfer(consumer1, 22092, {from: retailer2});
  await productContract.addReview(22092, 60, "Useful", {from: consumer1});
  console.log(await productContract.get(22092, {from: consumer1}));

  console.log("Stats: ")
  var count = await productContract.getProductsCount({from: consumer1});
  console.log("Products: " + count.words[0]);
  count = await productContract.getTransactionsCount({from: consumer2});
  console.log("Transactions: " + count.words[0]);
  count = await productContract.getReviewsCount({from: consumer2});
  console.log("Reviews: " + count.words[0]);

  console.log(await mainContract.getRole(admin));
  console.log(await mainContract.getRole(centralGov1));
  console.log(await mainContract.getRole(centralGov2));
  console.log(await mainContract.getRole(stateGov1));
  console.log(await mainContract.getRole(stateGov2));
  console.log(await mainContract.getRole(distributer));
  console.log(await mainContract.getRole(retailer1));
  console.log(await mainContract.getRole(retailer2));
  console.log(await mainContract.getRole(consumer1));
  console.log(await mainContract.getRole(consumer2));

  callback();
}