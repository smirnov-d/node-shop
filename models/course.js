const fs = require('fs');
const path = require('path');
const {v4} = require('uuid');

const storagePath = path.join(__dirname, '..', 'data', 'courses.json');

class Course {
  constructor({title, price, url}) {
    this.title = title;
    this.price = price;
    this.url = url;
    this.id = v4();
  }

  static async update(course) {
    let courses = '';
    try {
      courses = await Course.getAll();
    } catch (e) {
      throw e;
    }
    const findIdx = courses.findIndex(({id}) => id === course.id);
    courses[findIdx] = course;

    return new Promise((res, rej) => {
      fs.writeFile(storagePath, JSON.stringify(courses), (err) => {
        if (err) {
          rej(err);
        }
        res();
      })
    });
  }

  async save() {
    // console.log(data);
    let courses = '';
    try {
      courses = await Course.getAll();
    } catch (e) {
      throw e;
    }
    const {title, price, url, id} = this;
    courses.push({
      title,
      price,
      url,
      id,
    });
    console.log('courses', courses);

    return new Promise((res, rej) => {
      fs.writeFile(storagePath, JSON.stringify(courses), (err) => {
        if (err) {
          rej(err);
        }
        res();
      })
    });
  }

  static getAll() {
    return new Promise((res, rej) => {
      fs.readFile(
        storagePath,
        'utf-8',
        (err, content) => {
          if (err) {
            rej(err)
          }
          res(JSON.parse(content));
        }
      )
    });
  }

  static async getById(cId) {
    const courses = await Course.getAll();
    return courses.find(({id}) => id === cId);
  }
}

module.exports = Course;
