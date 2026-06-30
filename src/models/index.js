const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');


// one-to-one relationship between User and Cart
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE'});
Cart.belongsTo(User, { foreignKey: 'userId'});

//one-to-n relationship between Cart and CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE'});
CartItem.belongsTo(Cart, { foreignKey: 'cartId'});

//one-to-n relationship between Product and CartItem
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'RESTRICT'});
CartItem.belongsTo(Product, { foreignKey: 'productId'});

//one-to-n relationship between User and Order
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE'});
Order.belongsTo(User, { foreignKey: 'userId'});

//one-to-n relationship between Order and OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE'});
OrderItem.belongsTo(Order, { foreignKey: 'orderId'});

//one-to-n relationship between Product and OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'RESTRICT'});
OrderItem.belongsTo(Product, { foreignKey: 'productId'});

module.exports = {
    User,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem
};