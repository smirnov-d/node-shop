const fs = require('fs');
const path = require('path');
const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

class Cart {
  static async add(course) {
    const cart = await Cart.fetch();
    const idx = cart.courses.findIndex(({id}) => id === course.id);

    if (idx === -1) {
      cart.courses.push({
        ...course,
        count: 1,
      })
    } else {
      cart.courses[idx].count++
    }

    return new Promise((res, rej) => {
      fs.writeFile(filePath, JSON.stringify(cart), (err, content) => {
        if (err) {
          rej(err);
        }
        res();
      });
    })
  }
  static async remove(courseId) {
    let cart = await Cart.fetch();

    const idx = cart.courses.findIndex(({id}) => id === courseId);

    cart.courses[idx].count > 1 ? cart.courses[idx].count-- : cart.courses.splice(idx, 1);

    return new Promise((res, rej) => {
      fs.writeFile(filePath, JSON.stringify(cart), (err, content) => {
        if (err) {
          rej(err);
        }
        res(cart);
      });
    })
  }

  static async fetch() {
    return new Promise((res, rej) => {
      fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
          rej(err);
        }
        res(JSON.parse(content));
      });
    })
  }
}

module.exports = Cart;
