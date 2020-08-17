const {Schema, model} = require('mongoose');

const ordersSchema = new Schema({
  courses: [
    {
      count: {
        type: Number,
        required: true,
        default: 1,
      },
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      // course: {
      //   type: Object,
      //   required: true
      // }
    },
  ],
  // user: {
  //   id: Schema.Types.ObjectId,
  //   ref: 'User',
  // },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Orders', ordersSchema);
