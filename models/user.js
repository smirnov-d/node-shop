const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name:  {
    type: String,
    required: true,
  },
  password:  {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExp: {
    type: Date,
  },
  avatar: String,
  cart: {
    items:[
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Course',
        }
      },
    ]
  }
});

userSchema.methods.addToCart = function (course) {
  const items = [...this.cart.items];
  const idx = items.findIndex(({courseId}) => courseId.toString() === course.id.toString());
  if (idx !== -1) {
    items[idx].count++;
  } else {
    items.push({
      courseId: course._id,
      // ...course,
      count: 1,
    });
  }

  // todo: avoiding mutation. Why does it a good practice?
  this.cart.items = items;

  return this.save();
}

userSchema.methods.removeFromCart = function (id) {
  const items = [...this.cart.items];
  console.log('id', id, items);
  const idx = items.findIndex(({courseId}) => courseId.toString() === id.toString());
  console.log(idx);
  if (idx === -1) {
    return;
  }

  console.log('count', items[idx].count);

  if (items[idx].count === 1) {
    items.splice(idx, 1);
  } else {
    items[idx].count--;
  }

  this.cart.items = items;

  console.log('before return', this.cart.items);

  return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart.items = [];

  return this.save();
}

module.exports = model('User', userSchema);
