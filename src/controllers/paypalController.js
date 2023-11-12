import fetch from 'node-fetch';
const environment = process.env.PAYPAL_MODE || 'sandbox';
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_SECRET_KEY;
const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
import { v4 as uuidv4 } from 'uuid';
import orderModel from '~/models/orderModel';
import ErrorHandler from '~/utils/ErrorHandler';
import { generateRandomCode } from '~/utils/generateRandomString';
async function getAccessToken() {
  const auth = `${client_id}:${client_secret}`;
  const data = 'grant_type=client_credentials';
  const res = await fetch(endpoint_url + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
    },
    body: data,
  });
  const json = await res.json();
  return json.access_token;
}

const paypalController = {
  async createOrder(req, res, next) {
    try {
      const { items, totalPrice, intent } = req.body;
      const itemTotal = items.reduce((total, item) => {
        return total + parseFloat(item.unit_amount.value) * parseFloat(item.quantity);
      }, 0);
      getAccessToken()
        .then(async (access_token) => {
          let order_data = {
            intent: intent.toUpperCase(),
            purchase_units: [
              {
                reference_id: generateRandomCode(15),
                description: 'Mua sản phẩm sách',
                items: items,
                amount: {
                  currency_code: 'USD',
                  value: totalPrice,
                  breakdown: {
                    item_total: {
                      currency_code: 'USD',
                      value: itemTotal,
                    },
                  },
                },
              },
            ],
          };
          const response = await fetch(endpoint_url + '/v2/checkout/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'PayPal-Request-Id': uuidv4(),
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(order_data),
          });
          const json = await response.json();
          res.send(json);
        })
        .catch((error) => {
          return next(new ErrorHandler(error.message, 500));
        });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async successOrder(req, res, next) {
    const { cart, intent, orderId, paymentInfo, userId } = req.body;
    try {
      getAccessToken()
        .then((access_token) => {
          fetch(endpoint_url + '/v2/checkout/orders/' + orderId + '/' + intent, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          })
            .then((response) => response.json())
            .then(async (order) => {
              const shipping = order.purchase_units[0].shipping.address;
              const amount = order.purchase_units[0].payments.captures[0].amount.value;
              const totalPrice = Number(amount).toFixed(2);
              const data = {
                orderId,
                cart,
                userId,
                paymentInfo,
                shippingAddress: shipping,
                totalPrice,
              };
              await orderModel.create(data);
              res.send(order);
            })
            .catch((error) => {
              return next(new ErrorHandler(error.message, 500));
            });
        })
        .catch((error) => {
          return next(new ErrorHandler(error.message, 500));
        });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default paypalController;
