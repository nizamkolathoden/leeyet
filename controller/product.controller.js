const Bigpromise = require("../middleware/Bigpromise");
const cloudinary = require("cloudinary");
const Product = require("../model/product.model");
//product
exports.addProduct = Bigpromise(async (req, res) => {
  let imageArray = [];
  const { mrp, disscountPersntage, deliveryCharge } = req.body;
  // double check not necessary
  if (!mrp || !disscountPersntage || !deliveryCharge)
    return res.status(401).json({ error: "please enter required field " });
  const disscountPrice =
    (mrp * Number(disscountPersntage.replace("%", ""))) / 100;
  req.body.disscount = disscountPrice;
  req.body.price = mrp;
  req.body.deliveryCharge = deliveryCharge;
  const totalAmount = mrp - disscountPrice + deliveryCharge;
  req.body.totalAmount = totalAmount;
  //here iam using cloudinary you can use s3 or another cdn
  if (!req.files) {
    return res.status(401).json({ error: "Images are Required" });
  }
  if (req.files) {
    //single file
    if (!req.files.photos.length) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos.tempFilePath,
        {
          folder: "products",
        }
      );
      console.log(result);

      imageArray.push({
        id: result.asset_id,
        secure_url: result.secure_url,
      });
    }
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      console.log(result);

      imageArray.push({
        id: result.asset_id,
        secure_url: result.secure_url,
      });
    }
    console.log(imageArray);
  }
  req.body.photos = imageArray;
  req.body.user = req.user.id;
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    newProduct,
  });
});

exports.getAllProduct = Bigpromise(async (req, res) => {
  const resultPerPage = 6;

  const totalCount = await Product.countDocuments();
  let currentPage = req.query.page ? req.query.page : 1;

  const skipVal = resultPerPage * (currentPage - 1);
  const allProducts = await Product.find().limit(resultPerPage).skip(skipVal);

  res.json({
    sucess: true,
    data: {
      products: allProducts,
      pagenation: {
        totalCount,
        limit: resultPerPage,
        skip: skipVal,
      },
    },
  });
});

exports.getOneProduct = Bigpromise(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product Not Found" });

    res.json({
      sucess: true,
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.updateProduct = Bigpromise(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ error: "Product Not Found" });

  let imageArray = [];

  if (req.files) {
    //destory exisiting img

    for (let index = 0; index < product.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(product.photos[index].id);
    }

    //upload and save img
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: process.env.floderName,
        }
      );

      imageArray.push({
        id: result.asset_id,
        secure_url: result.secure_url,
      });
    }
    console.log(imageArray);
    req.body.photos = imageArray;
  }
  const updatedProduct = await Product.findOneAndUpdate({
    _id:req.params.id,user:req.user._id},
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({ updatedProduct });
});

exports.deleteProduct = Bigpromise(async (req, res) => {
  try {
    const product = await Product.findOne({_id:req.params.id,user:req.user._id});
    if (!product) return res.status(404).json({ error: "Product Not Found" });
    //dlt image from cdn
    for (let index = 0; index < product.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(product.photos[index].id);
    }

    await product.remove();
    res.json("Deleted Product !");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
