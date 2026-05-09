import Cart from "../model/Cart.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      address,
      paymentMethod,
      notes,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        message: "Customer name, email, and phone are required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          message: "One product in your cart is no longer available",
        });
      }

      const freshProduct = await Product.findById(product._id);

      if (!freshProduct || !freshProduct.isAvailable) {
        return res.status(400).json({
          message: `${product.name} is no longer available`,
        });
      }

      if (freshProduct.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${freshProduct.stock} item(s) available for ${freshProduct.name}`,
        });
      }

      const price = Number(freshProduct.price || 0);
      const quantity = Number(item.quantity || 0);
      const subtotal = price * quantity;

      orderItems.push({
        product: freshProduct._id,
        name: freshProduct.name,
        image: freshProduct.image || "",
        price,
        quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    const order = await Order.create({
      user: req.user._id,
      customerName,
      customerEmail,
      customerPhone,
      orderType: orderType || "pickup",
      address: address || "",
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      items: orderItems,
      totalAmount,
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -Number(item.quantity || 0) },
      });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "preparing", "ready", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
