// import orderSchema from "@/schemas/order-schema";
import { OrderT } from "@/types/order-types";
import Order from "../schemas/order-schema";
import { Request, Response } from "express";
// import Order
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.find();
    console.log("api called")
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Error fetching owners" });
  }
};


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      items, 
      paymentMethod, 
      deliveryAddress, 
      specialInstructions 
    } = req.body;

    if (!items || !paymentMethod) {
      res.status(400).json({ error: "User, owner, items, and payment method are required" });
      return;
    }

    const totalOrderPrice = items.reduce((total: number, item: any) => {
      return total + (item.totalPrice || 0);
    }, 0);

    const newOrder = new Order({ 
      items, 
      paymentMethod, 
      deliveryAddress, 
      specialInstructions,
      totalOrderPrice,
      orderDate: new Date()
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const order: OrderT | null = await Order.findById(id);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: Partial<OrderT> = req.body;

  try {
    // Prevent updating certain fields
    delete updates.orderDate;

    // Recalculate total price if items are updated
    if (updates.items) {
      updates.totalOrderPrice = updates.items.reduce((total: number, item: any) => {
        return total + (item.totalPrice || 0);
      }, 0);
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true, 
      runValidators: true,
    });

    if (!updatedOrder) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error updating order" });
  }
};


export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedOrder: OrderT | null = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ 
      message: "Order deleted successfully", 
      deletedOrder 
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting order" });
  }
};