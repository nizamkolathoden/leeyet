const router = require("express").Router();
const {
  addProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const { isloggedIn } = require("../middleware/auth");
//@route /api/v1/product/createProduct
router.post("/createProduct", isloggedIn, addProduct);

//@route /api/v1/product/allproduct
router.get("/allproduct", getAllProduct);

//@route /api/v1/product/allproduct
router
  .route("/product/:id")
  .get(getOneProduct)
  .put(isloggedIn, updateProduct)
  .delete(isloggedIn, deleteProduct);

module.exports = router;
