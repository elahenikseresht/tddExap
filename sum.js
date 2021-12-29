const Product = require('./model/product');
const sum = async (a, b) => {
  const p = await Product.create({ title: 'قهوه', price: 40000 });
  console.log(p);
  return a + b;
};

module.exports = sum;
