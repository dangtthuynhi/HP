var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var dialog = require('dialog-node');
var convertObjId = require('mongodb').ObjectId;
const faker = require('faker');
const multipartMiddleware = multipart();
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, Date.now() + '-' + file.originalname);
  }
})

//check chi cho upload file anh
function checkFileAnh(req, file, cb) {
  if (!file.originalname.match(/.(jpg|png|gif|jpeg)$/)) {
    cb(new Error('Bạn chỉ được upload file ảnh'))
  }
  else {
    cb(null, true)
  }
}
const upload = multer({ storage: storage, fileFilter: checkFileAnh });

const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'ShopPlants';
// function randomIntFromInterval(min, max) { // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
// /* GET home page. */
// router.get('/taosanpham', async (req, res, next) => {
//   var material_ = ['Fiberstone', 'Handpainting', 'Rough Cement', 'Outdoor Painting', 'Natural', 'Washed', 'Charcoalstone', 'Atlantis', 'Heritage', 'Sandstone', 'Stone Cement', 'Terrazzo'];
//   var shape_ = ['Round', 'Square', 'Rectangular', 'Oval', 'Egg', 'Octagonal', 'Other'];
//   var color_ = ['Black', 'Grey', 'Natural', 'Silver', 'Blue', 'Gold', 'Multi Colored'];
//   var page_ = ['New', 'BestSelling', 'None'];
//   for (let i = 0; i < 96; i++) {
//     const title = faker.commerce.productName();
//     const cover = faker.image.image();
//     const shape = shape_[randomIntFromInterval(0, shape_.length - 1)];
//     const color = color_[randomIntFromInterval(0, color_.length - 1)];
//     const material = material_[randomIntFromInterval(0, material_.length - 1)];
//     const page = page_[randomIntFromInterval(0, page_.length - 1)];
//     const img = faker.image.image();
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db(dbName);
//       var product = {
//         "Title": title,
//         "Cover": cover,
//         "Image": img,
//         "Color": color,
//         //"Size": '44x66x77',
//         "Material": material,
//         "Shape": shape,
//         "Page": page
//       };
//       dbo.collection("Product").insertOne(product, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//       });
//     });
//   }
//   res.redirect('/');
// })
// router.get('/taocontact', async (req, res, next) => {
//   for (let i = 0; i < 200; i++) {
//     const email_=faker.internet.email();
//     const name=faker.internet.userName();
//     const country=faker.address.country();
//     const message=faker.lorem.text();
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db(dbName);
//       //var email={'Email':email_,'Date':'2/10/2021'};
//       var contact = {
//         "Email": email_,
//         "Name": name,
//         "Country": country,
//         "Message": message,
//         "Date": '2/10/2021'
//       };
//       dbo.collection("Contact").insertOne(contact, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//       });
//     });
//   }
//   res.redirect('/');
// })
// router.get('/taoemail', async (req, res, next) => {
//   for (let i = 0; i < 200; i++) {
//     const email_=faker.internet.email();
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db(dbName);
//       var email={'Email':email_,'Date':'2/10/2021'};
//       dbo.collection("Email").insertOne(email, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//       });
//     });
//   }
//   res.redirect('/');
// })
// router.get('/taoblog', async (req, res, next) => {
//   for (let i = 0; i < 200; i++) {
//     const title=faker.name.title();
//     const cover=faker.random.image();
//     const post=faker.lorem.text();
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db(dbName);
//       var blog = {
//         "Date": '10/2/2021',
//         "Title": title,
//         "Cover": cover,
//         "Content": post
//       };
//       dbo.collection("Blog").insertOne(blog, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//       });
//     });
//   }
//   res.redirect('/');
// })
router.get('/', function (req, res, next) {
  var new_ = [];
  var bestselling = [];
  var blog_ = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("Product").find({ Page: 'New' }).limit(20).toArray(function (err, result) {
      if (err) throw err;
      //console.log(result);
      //var new_,bestselling;
      result.forEach(function (x) {
        new_ = new_.concat(x);
      })
      //db.close();
    });
    dbo.collection("Product").find({ Page: 'BestSelling' }).limit(20).toArray(function (err, result) {
      if (err) throw err;
      //console.log(result);
      //var new_,bestselling;
      result.forEach(function (x) {
        bestselling = bestselling.concat(x);
      })
      //db.close();
    });
    dbo.collection("Blog").find({}).limit(20).toArray(function (err, result) {
      if (err) throw err;
      //console.log(result);
      //var new_,bestselling;
      result.forEach(function (x) {
        blog_ = blog_.concat(x);
        //console.log(blog_);
      })
      console.log('hi');
      console.log(blog_, new_, bestselling);
      res.render('index', { product_new: new_, product_bs: bestselling, blog: blog_ });
      //res.send({product_new:new_,product_bs:bestselling,blog:blog_});
      db.close();
    });
  });

});
router.get('/shop', function (req, res, next) {
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("Product").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").countDocuments((err, count) => {
        if (err) return next(err);
        res.render('shop', { c: count, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(count / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});

router.get('/shop/color=:i', (req, res, next) => {
  var x = '';
  var color = ['Black', 'Grey', 'Natural', 'Silver', 'Blue', 'Gold', 'Multi Colored']
  switch (req.params.i) {
    case 'black':
      x = color[0];
      break;
    case 'grey':
      x = color[1];
      break;
    case 'natural':
      x = color[2];
      break;
    case 'silver':
      x = color[3];
      break;
    case 'blue':
      x = color[4];
      break;
    case 'gold':
      x = color[5];
      break;
    case 'multi-colored':
      x = color[6];
      break;
  }
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  //console.log('kkkkk');
  //console.log(req.originalUrl);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Color: x };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });

});
router.get('/shop/color=:i/:page', (req, res, next) => {
  var x = '';
  var color = ['Black', 'Grey', 'Natural', 'Silver', 'Blue', 'Gold', 'Multi Colored']
  switch (req.params.i) {
    case 'black':
      x = color[0];
      break;
    case 'grey':
      x = color[1];
      break;
    case 'natural':
      x = color[2];
      break;
    case 'silver':
      x = color[3];
      break;
    case 'blue':
      x = color[4];
      break;
    case 'gold':
      x = color[5];
      break;
    case 'multi-colored':
      x = color[6];
      break;
  }
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  if (page >= 10) {
    removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
  } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
  //console.log('Removing the last character: ', removeLastChar);
  //console.log('kkkkk');
  //console.log(req.originalUrl);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Color: x };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        //db.close();
      });
      //db.close();
    })
    //db.close();
  });

});
router.get('/shop/shape=:i', (req, res, next) => {
  var x = '';
  var shape = ['Round', 'Square', 'Rectangular', 'Oval', 'Egg', 'Octagonal', 'Other'];
  switch (req.params.i) {
    case 'round':
      x = shape[0];
      break;
    case 'square':
      x = shape[1];
      break;
    case 'rectangular':
      x = shape[2];
      break;
    case 'oval':
      x = shape[3];
      break;
    case 'egg':
      x = shape[4];
      break;
    case 'octagonal':
      x = shape[5];
      break;
    case 'other':
      x = shape[6];
      break;
  }
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  //console.log('kkkkk');
  //console.log(req.originalUrl);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Shape: x };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        //db.close();
      });
      //db.close();
    })
    //db.close();
  });

});
router.get('/shop/shape=:i/:page', (req, res, next) => {
  var x = '';
  var shape = ['Round', 'Square', 'Rectangular', 'Oval', 'Egg', 'Octagonal', 'Other'];
  switch (req.params.i) {
    case 'round':
      x = shape[0];
      break;
    case 'square':
      x = shape[1];
      break;
    case 'rectangular':
      x = shape[2];
      break;
    case 'oval':
      x = shape[3];
      break;
    case 'egg':
      x = shape[4];
      break;
    case 'octagonal':
      x = shape[5];
      break;
    case 'other':
      x = shape[6];
      break;
  }
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  //console.log('kkkkk');
  //console.log(req.originalUrl);
  if (page >= 10) {
    removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    console.log('Removing the last character: ', removeLastChar);
  }
  else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Shape: x };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        //db.close();
      });
      //db.close();
    })
    //db.close();
  });

});

router.get('/shop/material=:i', (req, res, next) => {
  var x = '';
  var material = ['Fiberstone', 'Handpainting', 'Rough Cement', 'Outdoor Painting', 'Natural', 'Washed', 'Charcoalstone', 'Atlantis', 'Heritage', 'Sandstone', 'Stone Cement', 'Terrazzo'];
  switch (req.params.i) {
    case 'fiberstone':
      x = material[0];
      break;
    case 'handpaiting':
      x = material[1];
      break;
    case 'rough-cement':
      x = material[2];
      break;
    case 'outdoor-painting':
      x = material[3];
      break;
    case 'natural':
      x = material[4];
      break;
    case 'washed':
      x = material[5];
      break;
    case 'charcoalstone':
      x = material[6];
      break;
    case 'atlantis':
      x = material[7];
      break;
    case 'heritage':
      x = material[8];
      break;
    case 'sandstone':
      x = material[9];
      break;
    case 'stone-cement':
      x = material[10];
      break;
    case 'terrazzo':
      x = material[11];
      break;
  }
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Material: x };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        //db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/shop/material=:i/:page', (req, res, next) => {
  var x = '';
  var material = ['Fiberstone', 'Handpainting', 'Rough Cement', 'Outdoor Painting', 'Natural', 'Washed', 'Charcoalstone', 'Atlantis', 'Heritage', 'Sandstone', 'Stone Cement', 'Terrazzo'];
  switch (req.params.i) {
    case 'fiberstone':
      x = material[0];
      break;
    case 'handpaiting':
      x = material[1];
      break;
    case 'rough-cement':
      x = material[2];
      break;
    case 'outdoor-painting':
      x = material[3];
      break;
    case 'natural':
      x = material[4];
      break;
    case 'washed':
      x = material[5];
      break;
    case 'charcoalstone':
      x = material[6];
      break;
    case 'atlantis':
      x = material[7];
      break;
    case 'heritage':
      x = material[8];
      break;
    case 'sandstone':
      x = material[9];
      break;
    case 'stone-cement':
      x = material[10];
      break;
    case 'terrazzo':
      x = material[11];
      break;
  }
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  if (page >= 10) {
    removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
  }
  else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Material: x };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        //db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/shop/:page', (req, res, next) => {
  let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  if (page >= 10) {
    removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
  }
  else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
  console.log('Removing the last character: ', removeLastChar);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("Product").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").countDocuments((err, count) => {
        if (err) return next(err);
        res.render('shop', { c: count, filter: removeLastChar, product: result, current: page, pages: Math.ceil(count / perPage) });
        //db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/blog/:page', function (req, res, next) {
  let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  if (page >= 10) {
    removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
  }
  else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("Blog").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Blog").countDocuments((err, count) => {
      if (err) throw err;
      res.render('blog', { filter: removeLastChar, blog: result, current: page, pages: Math.ceil(count / perPage) });
      //console.log(result);
      db.close();
    });
  });
});
});
router.get('/blog', function (req, res, next) {
  let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("Blog").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Blog").countDocuments((err, count) => {
      if (err) throw err;
      res.render('blog', { filter: req.originalUrl, blog: result, current: page, pages: Math.ceil(count / perPage) });
      //res.send({ filter: req.originalUrl, blog: result, current: page, pages: Math.ceil(count / perPage) });
      //console.log(result);
      db.close();
    });
  });
});
});
router.get('/product-details.:idproduct', function (req, res, next) {
  if (!req.session.productdaxem) {
    req.session.productdaxem = [];
  }
  var id = convertObjId(req.params.idproduct);
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { _id: id };
    dbo.collection("Product").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      var kt = true;
      req.session.productdaxem.forEach(function (x) {
        x.forEach(function (y) {
          if (y._id == id) {
            kt = false;
          }
        })
      })
      if (kt) {
        req.session.productdaxem.push(result);
      }
      res.render('product-details', { url:fullUrl,product: result, ds: req.session.productdaxem });
      db.close();
    });

  });

});
router.get('/blog-details.:idblog', function (req, res, next) {
  if (!req.session.blogdaxem) {
    req.session.blogdaxem = [];
  }
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var id = convertObjId(req.params.idblog);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { _id: id };
    dbo.collection("Blog").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      var kt = true;
      req.session.blogdaxem.forEach(function (x) {
        x.forEach(function (y) {
          if (y._id == id) {
            kt = false;
          }
        })
      })
      if (kt) {
        req.session.blogdaxem.push(result);
      }
      res.render('blog-details', { url:fullUrl,blog: result, ds: req.session.blogdaxem });
      db.close();
    });
  });
});
router.get('/login', function (req, res, next) {
  if (req.session.login) {
    res.render('admin-index');
  }
  else {
    res.render('login', { message: '' });
  }
});
router.get('/contact', function (req, res, next) {
  res.render('contact');
});
router.get('/about', function (req, res, next) {
  res.render('about');
});
router.get('/add-product', function (req, res, next) {
  if (req.session.login) {
    res.render('admin-add-product', { success: '' });
  }
  else res.render('error');
});
router.get('/add-category', function (req, res, next) {
  res.render('admin-add-categories');
});
router.get('/add-blog', function (req, res, next) {
  if (req.session.login) {
    res.render('admin-add-blog', { success: '' });
  }
  else res.render('error');
});
router.get('/email', function (req, res, next) {
  if (req.session.login) {
    let perPage = 50; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Email").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Email").countDocuments((err, count) => {
          if (err) throw err;
          res.render('admin-email', { filter: req.originalUrl, email: result, current: page, pages: Math.ceil(count / perPage) });
          //console.log(result);
          //db.close();
        });
      });
    });
  }
  else res.render('error');
});
router.get('/email/:page', function (req, res, next) {
  if (req.session.login) {
    let perPage = 50; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    }
    else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Email").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Email").countDocuments((err, count) => {
          if (err) throw err;
          res.render('admin-email', { filter: removeLastChar, email: result, current: page, pages: Math.ceil(count / perPage) });
          //console.log(result);
          db.close();
        });
      });
    });
  }
  else res.render('error');
});
router.get('/customer', function (req, res, next) {
  if (req.session.login) {
    let perPage = 50; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Contact").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Contact").countDocuments((err, count) => {
          if (err) throw err;
          res.render('admin-customer', { filter: req.originalUrl, contact: result, current: page, pages: Math.ceil(count / perPage) });
          //console.log(result);
          db.close();
        });
      });
    });
  }
  else res.render('error');
});
router.get('/customer/:page', function (req, res, next) {
  if (req.session.login) {
    let perPage = 50; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    }
    else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Contact").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Contact").countDocuments((err, count) => {
          if (err) throw err;
          res.render('admin-customer', { filter: removeLastChar, contact: result, current: page, pages: Math.ceil(count / perPage) });
          //console.log(result);
          db.close();
        });
      });
    });
  }
  else res.render('error');
});
router.get('/products', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Product").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Product").countDocuments((err, count) => {
          if (err) return next(err);
          res.render('admin-product', { c: count, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(count / perPage) });
          //db.close();
        });
        //db.close();
      })
      //db.close();
    });
  }
  else res.render('error');
});
router.get('/products/:page', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    }
    else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Product").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Product").countDocuments((err, count) => {
          if (err) return next(err);
          res.render('admin-product', { c: count, filter: removeLastChar, product: result, current: page, pages: Math.ceil(count / perPage) });
          db.close();
        });
        //db.close();
      })
      //db.close();
    });
  }
  else res.render('error');
});
router.get('/signup', function (req, res, next) {
  if (req.session.login) {
    res.render('admin-signup', { message: '' });
  }
  else res.render('error');
});

router.post('/add-contact', function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var country = req.body.country;
  var today = new Date();
  var d = today.getDate();
  var m = today.getMonth() + 1;
  var y = today.getFullYear();
  var date = d + '/' + m + '/' + y;
  //console.log(name+email+message+country);
  /*var sql = "INSERT INTO `contact` (name, email, message, country) VALUES ('"+name+"','"+email+"','"+message+"','"+country+"')";
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  return res.redirect("/contact");*/
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var contact = {
      "Email": email,
      "Name": name,
      "Country": country,
      "Message": message,
      "Date": date
    };
    dbo.collection("Contact").insertOne(contact, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.redirect('/contact');
});

router.post('/add-email', function (req, res, next) {

  var email = req.body.email;
  //var sql = "INSERT INTO `email` (email) VALUES ('"+email+"')";
  console.log(email);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var today = new Date();
    var d = today.getDate();
    var m = today.getMonth() + 1;
    var y = today.getFullYear();
    var date = d + '/' + m + '/' + y;
    var email_ = {
      "Email": email,
      "Date": date
    };
    dbo.collection("Email").insertOne(email_, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.redirect('/');
});

router.post('/add-product', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'img', maxCount: 10 }]), function (req, res, next) {

    var img_ = req.files.img;
    var cover = req.files.cover[0].filename;
    var color = req.body.color;
    var title = req.body.title.toUpperCase();
    var size_ = req.body.size;
    var material = req.body.material;
    var shape = req.body.shape;
    var page = req.body.page;
    //Xử lý img
    var img = [];
    img_.forEach(function (y) {
      img.push(y.filename);
    })
    //Xử lý size
    var size = [];
    var temp = size_.split(/\r\n/);
    temp.forEach(function (y) {
      var x = y.split('x');
      size.push(x);
    });
    console.log(img);
    console.log(cover);
    console.log(size);
    console.log(color);
    //lưu xuống database
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var product = {
        "Title": title,
        "Cover": cover,
        "Image": img,
        "Color": color,
        "Size": size,
        "Material": material,
        "Shape": shape,
        "Page": page
      };
      dbo.collection("Product").insertOne(product, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
    res.render('admin-add-product', { success: 'Thành công' });
  });

router.post('/add-image', multipartMiddleware, function (req, res, next) {
  try {
    fs.readFile(req.files.upload.path, function (err, data) {
      var newPath = './public/uploads/' + req.files.upload.name;
      fs.writeFile(newPath, data, function (err) {
        if (err) console.log({ err: err });
        else {
          console.log(req.files.upload.originalFilename);
          //     imgl = '/images/req.files.upload.originalFilename';
          //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
          //    res.status(201).send(img);

          let fileName = req.files.upload.name;
          let url = '/uploads/' + fileName;
          let msg = 'Upload successfully';
          let funcNum = req.query.CKEditorFuncNum;
          console.log({ url, msg, funcNum });

          res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});
router.post('/add-blog', upload.single('img'), function (req, res, next) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  var title = req.body.title;
  var post = req.body.txtContent;
  var img = req.file.filename;
  console.log(post);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var blog = {
      "Date": today,
      "Title": title,
      "Cover": img,
      "Content": post
    };
    dbo.collection("Blog").insertOne(blog, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.render('admin-add-blog', { success: 'Thành công' });
});
router.get('/delete-product.:idproduct', function (req, res, next) {
  var id = convertObjId(req.params.idproduct);
  console.log(id);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myquery = { _id: id };
    dbo.collection("Product").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
  res.redirect('/products');
});
router.get('/edit-product.:idproduct', function (req, res, next) {
  if (req.session.login) {
    var id = convertObjId(req.params.idproduct);
    console.log(id);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var query = { _id: id };
      dbo.collection("Product").find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log('edit');
        console.log(result);
        res.render('admin-edit-product', { product: result, success: '' });
        db.close();
      });
    });
  } else res.render('error');
});
router.post('/edit-product.:idproduct', function (req, res, next) {
  var id = convertObjId(req.params.idproduct);
  console.log(id);
  var page = req.body.page;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myquery = { _id: id };
    var newvalues = { $set: { Page: page } };
    dbo.collection("customers").updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  res.render('admin-edit-product', { success: 'Thành công', product: '' });
});
router.post('/login', function (req, res, next) {
  //var username=req.body.username;
  //var password=req.body.password;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { username: req.body.username };
    dbo.collection("Account").findOne(query).then(function (result) {
      if (err) throw err;
      if (null == result) {
        console.log("username not found");
        res.render('login', { message: 'Username not found' });
      }
      else {
        if (req.body.password == result.password) {
          req.session.login = true;
          res.render('admin-index');
        }
        else {
          res.render('login', { message: 'Password not correct' });
        }
      }
      db.close();
    })
  });
});
router.post('/signup', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    myobj = { "username": req.body.username, "password": req.body.password };
    var query = { username: req.body.username }
    dbo.collection("Account").findOne(query).then(function (result) {
      if (err) throw err;
      if (null != result) {
        console.log("username already exists");
        res.render('admin-signup', { message: 'username already exists' });
      }
    })
    dbo.collection("Account").insertOne(myobj, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      res.render('admin-signup', { message: 'successful' });
      db.close();
    })
  });
});
router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    return res.status(200).json({ status: 'success', session: 'cannot access session here' })
  })
});
router.get('/admin-blog', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Blog").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Blog").countDocuments((err, count) => {
          if (err) throw err;
          res.render('admin-blog', { filter: req.originalUrl, blog: result, current: page, pages: Math.ceil(result.length / perPage) });
          //console.log(result);
          db.close();
        });
      });
    });
  }
  else res.render('error');
});
router.get('/admin-blog/:page', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection("Blog").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Blog").countDocuments((err, count) => {
          if (err) throw err;
          res.render('admin-blog', { filter: removeLastChar, blog: result, current: page, pages: Math.ceil(result.length / perPage) });
          //console.log(result);
          db.close();
        });
      });
    })
  }
  else res.render('error');
});
router.post('/search-product', function (req, res, next) {
  let perPage = 30; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    req.session.search = req.body.search;
    var query = { Title: { '$regex': req.body.search, '$options': 'i' } };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/search-product/:page', function (req, res, next) {
  let perPage = 30; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Title: { '$regex': req.session.search, '$options': 'i' } };
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('shop', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.post('/search-product-admin', function (req, res, next) {
  let perPage = 50; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    req.session.search = req.body.search;
    var query = { Title: { '$regex': req.body.search, '$options': 'i' } };
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-product', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/search-product-admin/:page', function (req, res, next) {
  let perPage = 50; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Title: { '$regex': req.session.search, '$options': 'i' } };
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Product").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-product', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.post('/search-blog-admin', function (req, res, next) {
  let perPage = 20; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    req.session.search = req.body.search;
    var query = { Title: { '$regex': req.body.search, '$options': 'i' } };
    dbo.collection("Blog").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Blog").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-blog', { c: r.length, filter: req.originalUrl, blog: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/search-blog-admin/:page', function (req, res, next) {
  let perPage = 20; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Title: { '$regex': req.session.search, '$options': 'i' } };
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    dbo.collection("Blog").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Blog").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-blog', { c: r.length, filter: removeLastChar, blog: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.post('/search-customer-admin', function (req, res, next) {
  let perPage = 60; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    req.session.search = req.body.search;
    var query = { Name: { '$regex': req.body.search, '$options': 'i' } };
    dbo.collection("Contact").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Contact").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-customer', { c: r.length, filter: req.originalUrl, contact: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/search-customer-admin/:page', function (req, res, next) {
  let perPage = 60; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Name: { '$regex': req.session.search, '$options': 'i' } };
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    dbo.collection("Contact").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Contact").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-customer', { c: r.length, filter: removeLastChar, contact: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.post('/search-email-admin', function (req, res, next) {
  let perPage = 60; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    req.session.search = req.body.search;
    var query = { Email: { '$regex': req.body.search, '$options': 'i' } };
    dbo.collection("Email").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Email").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-email', { c: r.length, filter: req.originalUrl, email: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/search-email-admin/:page', function (req, res, next) {
  let perPage = 60; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { Email: { '$regex': req.session.search, '$options': 'i' } };
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    } else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    dbo.collection("Email").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
      dbo.collection("Email").find(query).toArray((err, r) => {
        if (err) return next(err);
        res.render('admin-email', { c: r.length, filter: removeLastChar, email: result, current: page, pages: Math.ceil(r.length / perPage) });
        db.close();
      });
      //db.close();
    })
    //db.close();
  });
});
router.get('/products-new', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var query={Page:'New'}
      dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Product").find(query).toArray((err, r) => {
          if (err) return next(err);
          res.render('admin-product', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
          db.close();
        });
        //db.close();
      })
      //db.close();
    });
  }
  else res.render('error');
});
router.get('/products-new/:page', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    }
    else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var query={Page:'New'}
      dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Product").find(query).toArray((err, r) => {
          if (err) return next(err);
          res.render('admin-product', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
          db.close();
        });
        //db.close();
      })
        //db.close();
      })
      //db.close();
  }
  else res.render('error');
});
router.get('/products-bestselling', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var query={Page:'BestSelling'}
      dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Product").find(query).toArray((err, r) => {
          if (err) return next(err);
          res.render('admin-product', { c: r.length, filter: req.originalUrl, product: result, current: page, pages: Math.ceil(r.length / perPage) });
          db.close();
        });
        //db.close();
      })
      //db.close();
    });
  }
  else res.render('error');
});
router.get('/products-bestselling/:page', function (req, res, next) {
  if (req.session.login) {
    let perPage = 25; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1;
    if (page >= 10) {
      removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 3);
    }
    else removeLastChar = req.originalUrl.slice(0, req.originalUrl.length - 2);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var query={Page:'BestSelling'}
      dbo.collection("Product").find(query).skip((perPage * page) - perPage).limit(perPage).toArray((err, result) => {
        dbo.collection("Product").find(query).toArray((err, r) => {
          if (err) return next(err);
          res.render('admin-product', { c: r.length, filter: removeLastChar, product: result, current: page, pages: Math.ceil(r.length / perPage) });
          db.close();
        });
        //db.close();
      })
        //db.close();
      })
      //db.close();
  }
  else res.render('error');
});

module.exports = router;
