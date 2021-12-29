const express = require('express');
const router = express.Router();
const Product = require('./../model/product');
router
  .route('/api/product')
  .get(async (req, res) => {
    const product = await Product.find({});
    return res.status(200).json({ message: 'all products', data: product });
  })
  .post(async (req, res, next) => {
    try {
      if (req.body.price <= 0)
        return res.status(400).send({
          message: 'price can not be equal or less than 0!',
          data: {},
        });

      let product = await Product.find({ title: req.body.title });
      if (product.length) {
        console.log(product);
        return res.status(400).send({
          message: 'a product with this name exists in product list!',
          data: {},
        });
      }
      product = await Product.create({
        ...req.body,
      });

      res.status(201).send({ message: 'product created', data: product });
    } catch (error) {
      next(error);
    }
  });

router

  .route('/api/product/:id')
  .get(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).send({
        message: 'product did not found!',
        data: {},
      });
    return res.status(200).send({ message: 'product', data: product });
  })
  .put(async (req, res) => {
    try {
      if (req.body.price <= 0)
        return res.status(400).send({
          message: 'price can not be equal or less than 0!',
          data: {},
        });
      let product = await Product.findById(req.params.id);
      if (!product)
        return res.status(400).send({
          message: 'product did not found!',
          data: {},
        });
      product = await Product.find({
        title: req.body.title,
      });
      if (product.length) {
        console.log(product);
        return res.status(400).send({
          message: 'a product with this name exists in product list!',
          data: {},
        });
      }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        { new: true }
      );

      return res
        .status(200)
        .send({ message: 'product updated', data: product });
    } catch (error) {
      console.log(error);
    }
  })

  .delete(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).send({
        message: 'product did not found!',
        data: {},
      });
    await Product.findByIdAndDelete(req.params.id);
    return res.status(204).send({});
  });

module.exports = { router };
