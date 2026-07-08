const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{ListingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../model/listing.js");
const {validateReview} = require("../middleware.js");
const Review = require("../model/review.js");
const {isLoggedIn,isreviewAuthor}= require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//Reviews
//post review Route
router.post("/",
   isLoggedIn,
   validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",
   isLoggedIn,
   isreviewAuthor,
   wrapAsync(reviewController.destroyReview));



module.exports = router;