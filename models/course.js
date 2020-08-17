const fs = require('fs');
const path = require('path');
const {v4} = require('uuid');

const {Schema, model} = require('mongoose');

const course = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

course.method('toClient', function () {
  const course = this.toObject();

  course.id = course._id;
  delete course._id;
  return course;
})

module.exports = model('Course', course);

//
//
//
// const storagePath = path.join(__dirname, '..', 'data', 'courses.json');
//
// class Course {
//   constructor({title, price, url}) {
//     this.title = title;
//     this.price = price;
//     this.url = url;
//     this.id = v4();
//   }
//
//   static async update(course) {
//     let courses = '';
//     try {
//       courses = await Course.getAll();
//     } catch (e) {
//       throw e;
//     }
//     const findIdx = courses.findIndex(({id}) => id === course.id);
//     courses[findIdx] = course;
//
//     return new Promise((res, rej) => {
//       fs.writeFile(storagePath, JSON.stringify(courses), (err) => {
//         if (err) {
//           rej(err);
//         }
//         res();
//       })
//     });
//   }
//
//   async save() {
//     // console.log(data);
//     let courses = '';
//     try {
//       courses = await Course.getAll();
//     } catch (e) {
//       throw e;
//     }
//     const {title, price, url, id} = this;
//     courses.push({
//       title,
//       price,
//       url,
//       id,
//     });
//     console.log('courses', courses);
//
//     return new Promise((res, rej) => {
//       fs.writeFile(storagePath, JSON.stringify(courses), (err) => {
//         if (err) {
//           rej(err);
//         }
//         res();
//       })
//     });
//   }
//
//   static getAll() {
//     return new Promise((res, rej) => {
//       fs.readFile(
//         storagePath,
//         'utf-8',
//         (err, content) => {
//           if (err) {
//             rej(err)
//           }
//           res(JSON.parse(content));
//         }
//       )
//     });
//   }
//
//   static async getById(cId) {
//     const courses = await Course.getAll();
//     return courses.find(({id}) => id === cId);
//   }
// }
//
// module.exports = Course;
