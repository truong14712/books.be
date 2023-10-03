import createHttpError from 'http-errors';
import cartModel from '~/models/cartModel';
const cartService = {
  async create(data) {
    try {
      const { userId, books } = data;
      const cart = await cartModel.findOne({ userId });
      if (cart) {
        for (const book of books) {
          const { bookId, quantity } = book;
          let bookExists = false;
          // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
          for (const element of cart.books) {
            if (element.bookId == bookId) {
              // Nếu sản phẩm đã tồn tại, tăng số lượng lên
              element.quantity += +quantity;
              bookExists = true;
              break;
            }
          }
          if (!bookExists) {
            cart.books.push({ bookId, quantity });
          }
          await cart.save();
          return cart;
        }
      } else {
        const newCart = new cartModel({ userId, books });
        await newCart.save();
        return newCart;
      }
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async update(data) {
    try {
      const { userId, books } = data;
      const cart = await cartModel.findOne({ userId });
      if (cart) {
        for (const book of books) {
          const { bookId, quantity } = book;
          let bookExists = false;
          // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
          for (const element of cart.books) {
            if (element.bookId == bookId) {
              // Nếu sản phẩm đã tồn tại, tăng số lượng lên
              element.quantity -= +quantity;
              bookExists = true;
              break;
            }
          }
          if (!bookExists) {
            cart.books.push({ bookId, quantity });
          }
          await cart.save();
          return cart;
        }
      } else {
        const newCart = new cartModel({ userId, books });
        await newCart.save();
        return newCart;
      }
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  //Xóa sản phẩm trong giỏ hàng
  async updateInCart(data) {
    try {
      const { userId, books } = data;
      const cart = await cartModel.findOne({ userId });
      if (!cart) {
        throw createHttpError(404, 'Cart not found');
      }
      cart.books = books;

      await cart.save();
      return cart;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async clearCarts(data) {
    try {
      const result = await cartModel.updateMany(
        { 'books.bookId': { $in: data } }, // Specify the condition to match the bookIds
        { $pull: { books: { bookId: { $in: data } } } }, // Use $pull to remove the matched books from the array
      );
      // Kiểm tra số lượng giỏ hàng đã bị xóa
      if (result.deletedCount === 0) {
        throw createHttpError(404, 'Carts not found');
      }

      return result;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  // Mua xong thì xóa giỏ hàng
  async delete(id) {
    try {
      const cart = await cartModel.findOneAndDelete({ userId: id });
      return cart;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async getById(id) {
    try {
      const cart = await cartModel.findOne({ userId: id }).populate('books.bookId');
      if (!cart) {
        return [];
      }
      return cart;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async getAll() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async updateCartItemQuantity(data) {
    try {
      const { userId, books } = data;
      const cart = await cartModel.findOne({ userId });
      if (cart) {
        for (const book of books) {
          const { bookId, quantity } = book;
          let bookExists = false;
          // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
          for (const element of cart.books) {
            if (element.bookId == bookId) {
              // Nếu sản phẩm đã tồn tại, tăng số lượng lên
              element.quantity = +quantity;
              bookExists = true;
              break;
            }
          }
          if (!bookExists) {
            cart.books.push({ bookId, quantity });
          }
          await cart.save();
          return cart;
        }
      } else {
        const newCart = new cartModel({ userId, books });
        await newCart.save();
        return newCart;
      }
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default cartService;
