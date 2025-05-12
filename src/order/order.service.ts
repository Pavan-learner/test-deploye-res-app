import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateOrderDto } from './dto/createOrder.dto';
import { catchError } from 'rxjs';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  // * bussiness services
  // before the processing of the order the waiter will intiate the order i mean create the order.
  async intiateOrder(orderDto: CreateOrderDto) {
    try {
      // here we created the order so after this the waiter can add the order details and selected addons
      const order = await this.prismaService.order.create({
        data: {
          number: orderDto.number,
          status: 'HOLD',
          restaurantId: orderDto.restaurantId,
          table_number: orderDto.table_number,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Error creating order ');
      }

      return order;
    } catch (error) {
      console.log('the error is ', error);
      throw new InternalServerErrorException('Error creating order ');
    }
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto) {
    try {
      // get the order by id
      const order = await this.prismaService.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Error creat order ');
      }

      // update the order based on the updateOrderDto
      const updateOrder = await this.prismaService.$transaction(async (tx) => {
        for (const item of updateOrderDto.items) {
          // this "id" refers to the orderDetail id
          if (item?.id) {
            // create new order detail for each update operation
            await tx.orderDetail.update({
              where: { id: item.id },
              data: {
                orderId: orderId,
                menuId: item.menuId,
                quantity: item.quantity,
                price: item.price,
                notes: item.notes,
                variantId: item.variantId,
              },
            });

            // Sync addons for this order detail
            if (item.addons && item.addons.length > 0) {
              for (const addon of item.addons) {
                if (addon.id) {
                  await tx.orderAddon.update({
                    where: { id: addon.id },
                    data: {
                      addonGroupItemId: addon.addonGroupItemId,
                      name: addon.name,
                      quantity: addon.quantity,
                      price: addon.price,
                    },
                  });
                } else {
                  await tx.orderAddon.create({
                    data: {
                      orderDetailId: item.id,
                      addonGroupItemId: addon.addonGroupItemId,
                      name: addon.name,
                      quantity: addon.quantity,
                      price: addon.price,
                    },
                  });
                }
              }
            }
          } else {
            // Handle new items if needed
            // Add code here to create new order details

            // create new order detail for each update operation
            const newOrderDetail = await tx.orderDetail.create({
              data: {
                orderId: orderId,
                menuId: item.menuId,
                quantity: item.quantity,
                price: item.price,
                notes: item.notes,
                ...(item.variantId && { variantId: item.variantId }), // only include if valid
              },
            });

            // Sync addons for this order detail
            if (item.addons && item.addons.length > 0) {
              for (const addon of item.addons) {
                await tx.orderAddon.create({
                  data: {
                    orderDetailId: newOrderDetail.id,
                    addonGroupItemId: addon.addonGroupItemId,
                    name: addon.name,
                    quantity: addon.quantity,
                    price: addon.price,
                  },
                });
              }
            }
          }
        }

        // if the customer wants to remove the item from the order then we will remove the item from the order detail.
        if (updateOrderDto.itemIdstoRemove) {
          await tx.orderDetail.deleteMany({
            where: {
              orderId,
              id: { in: updateOrderDto.itemIdstoRemove },
            },
          });
        }

        // Return the updated order or whatever you want to return
        return await tx.order.findUnique({
          where: { id: orderId },
          include: {
            // Include relations as needed
            orderDetails: true,
            // other relations
          },
        });
      });

      return {
        orderId: orderId,
        order: updateOrder,
      };
    } catch (error) {
      console.log('the error is ', error);
      throw new InternalServerErrorException('Error updating order ');
    }
  }

  // Submit order
  async submitOrder(orderId: string) {
    try {
      const order = await this.prismaService.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderDetails: {
            include: {
              menu: true,
              variant: true,
              orderAddons: true,
            },
          },
          restaurant: true,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Error creating order ');
      }

      const { activeTaxes, activeDiscounts, activeCharges } =
        await this.fetchActiveTaxesDiscountsCharges(order.restaurantId); // Step 2

      const totalDiscounts = await this.applyDiscounts(
        order.id,
        activeDiscounts,
      ); // Step 4

      const totalCharges = await this.applyCharges(order.id, activeCharges); // Step 5

      const totalTaxes = await this.applyTaxes(order.id, activeTaxes); // Step 6

       // here we will add the menu and it's variant and addons prices.
       var subTotal = order.subTotal || 0;

      const grandTotal = await this.calculateGrandTotalAndSave(
        subTotal,
        totalDiscounts,
        totalCharges,
        totalTaxes,
        order.id,
      ); // Step 7

      // Return everything including applied details
      const appliedTaxes = await this.prismaService.orderTax.findMany({
        where: { orderId: order.id },
      });

      const appliedDiscounts = await this.prismaService.orderDiscount.findMany({
        where: { orderId: order.id },
      });

      const appliedCharges = await this.prismaService.orderCharge.findMany({
        where: { orderId: order.id },
      });

      // Traversting the order detail items so we can get the final amount of the order but in future we are going to
      // add the taxes and discountss and charges as well.
      for (const item of order.orderDetails) {
        // console.log("item price and qty is ", item.price, item.quantity);
        subTotal += item.price * item.quantity; // price of the menu * quantity of the menu
        if (item.variantId) {
          const variant = await this.prismaService.menuVariant.findUnique({
            where: { id: item.variantId },
          });

          if (variant) {
            // console.log("variant price and qty is ", variant.price, item.quantity);
            subTotal += variant.price * item.quantity; // price of the variant * quantity of the menu
          } else {
            throw new InternalServerErrorException(
              'Error processing order becasue of variant id does not exist on the db',
            );
          }
        }

        if (item.orderAddons && item.orderAddons.length > 0) {
          for (const addon of item.orderAddons) {
            // console.log("addon price and qty is ", addon.price, addon.quantity);
            subTotal += addon.price * addon.quantity; // price of the addon * quantity of the menu
          }
        }
      }

      const orderUpdate = await this.prismaService.order.update({
        where: {
          id: orderId,
        },
        data: {
          subTotal: subTotal,
          total_amount: subTotal,
          discount: totalDiscounts,
          charges: totalCharges,
          tax: totalTaxes,
          status: 'COMPLETED',
        },
      });

      if (!orderUpdate) {
        throw new InternalServerErrorException('Error saving  order ');
      }
    } catch (error) {
      console.log('the error is ', error);
      throw new InternalServerErrorException('Error updating order ');
    }
  }

  // CRUD operation functions for the order
  async updateOrderCRUD(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // 1. Update main order if needed
        await tx.order.update({
          where: { id: id },
          data: {
            status: updateOrderDto.status!,
            isModified: updateOrderDto.isModified,
            table_number: updateOrderDto.table_number,
          },
        });

        // 2. Sync OrderDetails
        for (const item of updateOrderDto.items) {
          if (item.id) {
            // Update existing order detail
            await tx.orderDetail.update({
              where: { id: item.id },
              data: {
                menuId: item.menuId,
                quantity: item.quantity,
                price: item.price,
                notes: item.notes,
                variantId: item.variantId,
              },
            });

            // Sync addons for this order detail
            if (item.addons && item.addons.length > 0) {
              for (const addon of item.addons) {
                if (addon.id) {
                  await tx.orderAddon.update({
                    where: { id: addon.id },
                    data: {
                      addonGroupItemId: addon.addonGroupItemId,
                      name: addon.name,
                      quantity: addon.quantity,
                      price: addon.price,
                    },
                  });
                } else {
                  await tx.orderAddon.create({
                    data: {
                      orderDetailId: item.id,
                      addonGroupItemId: addon.addonGroupItemId,
                      name: addon.name,
                      quantity: addon.quantity,
                      price: addon.price,
                    },
                  });
                }
              }
            }
          } else {
            // Handle new items if needed
            // Add code here to create new order details
          }
        }

        // Return the updated order or whatever you want to return
        return await tx.order.findUnique({
          where: { id },
          include: {
            // Include relations as needed
            orderDetails: true,
            // other relations
          },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating order ', error);
    }
  }

  async deleteOrder(id: string) {
    try {
      return this.prismaService.order.delete({
        where: {
          id: id, // Replace with the order ID you want to delete
        },
      });
    } catch (error) {
      console.log('the error is ', error);
      throw new InternalServerErrorException('Error deleting order ', error);
    }
  }

  async getAllOrders() {
    return this.prismaService.order.findMany({
      include: {
        restaurant: true,
      },
    });
  }

  async getOrderById(id: string) {
    return this.prismaService.order.findUnique({
      where: {
        id: id, // Replace with the order ID you want to retrieve
      },
      include: {
        restaurant: true,
      },
    });
  }

  async getOrdersByRestaurantId(resId: string, page: number, limit: number) {
    try {
      const offset = (page - 1) * limit; // Calculate the offset for pagination

      const orders = await this.prismaService.order.findMany({
        skip: offset,
        take: limit,
        where: {
          restaurantId: resId,
        },
      });

      // Getting the total number of categories in the database
      const total = await this.prismaService.order.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit < Math.ceil(total / limit);

      return {
        orders,
        hasPreviousPage,
        hasNextPage,
        page,
        limit,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching orders by restaurant ID ',
        error,
      );
    }
  }

  // Step 2: Fetch active taxes, discounts, and charges
  async fetchActiveTaxesDiscountsCharges(restaurantId: string) {
    const [activeTaxes, activeDiscounts, activeCharges] = await Promise.all([
      this.prismaService.tax.findMany({
        where: { restaurantId, status: true, name: 'SALES TAX' }, // Fetch active taxes
      }),
      this.prismaService.discount.findMany({
        where: { restaurantId, status: true, applyTo: 'ORDER' }, // Fetch active discounts
      }),
      this.prismaService.charge.findMany({
        where: { restaurantId, status: true, applyTo: 'ORDER' }, // Fetch active charges
      }),
    ]);

    return { activeTaxes, activeDiscounts, activeCharges };
  }

  // // Step 3: Calculate totalAmount for all items in the order
  async calculateBaseTotalAmount(orderId: string) {
    const orderDetails = await this.prismaService.orderDetail.findMany({
      where: { orderId },
      include: {
        menu: true,
        variant: true,
        orderAddons: true,
      },
    });

    let totalAmount = 0;

    orderDetails.forEach((item) => {
      let itemTotal = item.price * item.quantity;

      if (item.variant) {
        itemTotal += item.variant.price * item.quantity;
      }

      item.orderAddons.forEach((addon) => {
        itemTotal += addon.price * addon.quantity;
      });

      totalAmount += itemTotal;
    });

    return totalAmount;
  }

  // // Step 4: Apply discounts and calculate totalDiscounts
  async applyDiscounts(orderId: string, activeDiscounts: any[]) {
    let totalDiscounts = 0;

    for (const discount of activeDiscounts) {
      const discountAmount = await this.calculateDiscountAmount(
        orderId,
        discount,
      );
      totalDiscounts += discountAmount;

      await this.prismaService.orderDiscount.create({
        data: {
          orderId,
          discountId: discount.id,
          name: discount.name,
          value: discount.value,
          valueType: discount.valueType,
          amount: discountAmount,
        },
      });
    }

    return totalDiscounts;
  }

  async calculateDiscountAmount(orderId: string, discount: any) {
    const orderTotalAmount = await this.calculateBaseTotalAmount(orderId); // Get base total amount

    if (discount.valueType === 'PERCENTAGE') {
      return (discount.value / 100) * orderTotalAmount;
    } else if (discount.valueType === 'DOLLAR') {
      return discount.value;
    }
  }

  // // Step 5: Apply charges and calculate totalCharges
  async applyCharges(orderId: string, activeCharges: any[]) {
    let totalCharges = 0;

    for (const charge of activeCharges) {
      const chargeAmount = await this.calculateChargeAmount(orderId, charge);
      totalCharges += chargeAmount;

      await this.prismaService.orderCharge.create({
        data: {
          name: charge.name,
          chargeType: charge.chargeType,
          value: charge.chargeCost,
          amount: chargeAmount,
          order: {
            connect: {
              id: orderId, // connect to the order
            },
          },
          charge: {
            connect: {
              id: charge.id, // connect to the charge
            },
          },
        },
      });
    }

    return totalCharges;
  }

  // // *  calculating charge cost based on charge type
  async calculateChargeAmount(orderId: string, charge: any) {
    const orderTotalAmount = await this.calculateBaseTotalAmount(orderId); // Get base total amount

    if (charge.chargeType === 'PERCENTAGE') {
      return (charge.chargeCost / 100) * orderTotalAmount;
    } else if (charge.chargeType === 'DOLLAR') {
      return charge.value;
    }

    return 0;
  }

  // // Step 6: Apply taxes and calculate totalTaxes
  async applyTaxes(orderId: string, activeTaxes: any[]) {
    let totalTaxes = 0;

    for (const tax of activeTaxes) {
      const taxAmount = await this.calculateTaxAmount(orderId, tax);
      totalTaxes += taxAmount;

      await this.prismaService.orderTax.create({
        data: {
          orderId,
          taxId: tax.id,
          name: tax.name,
          rate: tax.rate,
          amount: taxAmount,
        },
      });
    }

    return totalTaxes;
  }

  async calculateTaxAmount(orderId: string, tax: any) {
    const orderTotalAmount = await this.calculateBaseTotalAmount(orderId);

    return (tax.rate / 100) * orderTotalAmount;
  }

  // Step 7: Calculate grandTotal and save everything
  async calculateGrandTotalAndSave(
    totalAmount : number,
    totalDiscounts: number,
    totalCharges: number,
    totalTaxes: number,
    orderId:string
  ) {
    const grandTotal = totalAmount - totalDiscounts + totalCharges + totalTaxes;

    await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        subTotal: totalAmount,
        discount: totalDiscounts,
        charges: totalCharges,
        tax: totalTaxes,
        total_amount: grandTotal,
      },
    });

    return grandTotal;
  }
}
