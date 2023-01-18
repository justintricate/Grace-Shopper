const router = require("express").Router();
const {
  models: { User },
} = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["firstName", "lastName", "image", "id", "email"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/cart/getAll", async (req, res, next) => {
  try {
    const user = await User.findAll({ attributes: ["id", "cart"] });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

router.get("/cart/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ["id", "cart"],
    });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

router.put("/cart/:userId/add", async (req, res, next) => {
  try {
    const userCart = await User.findByPk(req.params.userId, {
      attributes: ["id", "cart"],
    });
    if (userCart.dataValues.cart === null) {
      userCart.dataValues.cart = [];
    }
    userCart.dataValues.cart.push(req.body);
    await User.update(
      { cart: userCart.dataValues.cart },
      { where: { id: `${req.params.userId}` } }
    );
    res.status(202).send(userCart);
  } catch (err) {
    next(err);
  }
});

router.put("/cart/:userId/remove", async (req, res, next) => {
  try {
    const userCart = await User.findByPk(req.params.userId, {
      attributes: ["id", "cart"],
    });
    const updatedCart = userCart.dataValues.cart.filter((item) => {
      return item.sku != req.body.sku;
    });
    await User.update(
      { cart: updatedCart },
      { where: { id: `${req.params.userId}` } }
    );
    res.status(202).send(userCart);
  } catch (err) {
    next(err);
  }
});

// router.put("/cart/:userId/updateQuantity", async (req, res, next) => {
//   try {
//     const userCart = await User.findByPk(req.params.userId, {
//       attributes: ["id", "cart"],
//     });
//     let itemToUpdate = userCart.dataValues.cart.filter((item) => {
//       return item.sku === req.body.sku;
//     });
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
