import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

const getPopulatedCart = async (cartId) => {
  return await Cart.findById(cartId).populate("items.product");
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }

    if (qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const productDoc = await Product.findById(product);

    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!productDoc.isAvailable || productDoc.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const cart = await getOrCreateCart(req.user._id);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    const currentQuantity =
      itemIndex > -1 ? Number(cart.items[itemIndex].quantity || 0) : 0;

    const newQuantity = currentQuantity + qty;

    if (newQuantity > productDoc.stock) {
      return res.status(400).json({
        message: `Only ${productDoc.stock} item(s) available in stock`,
      });
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product, quantity: qty });
    }

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      message: "Item added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!qty || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const productDoc = await Product.findById(req.params.productId);

    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!productDoc.isAvailable || productDoc.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    if (qty > productDoc.stock) {
      return res.status(400).json({
        message: `Only ${productDoc.stock} item(s) available in stock`,
      });
    }

    item.quantity = qty;
    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      message: "Cart item updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is already empty",
        cart: { user: req.user._id, items: [] },
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    cart.items = [];
    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
