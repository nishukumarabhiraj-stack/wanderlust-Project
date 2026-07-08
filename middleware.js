const Listing = require("./model/listing");
const Review = require("./model/review.js");
const ExpressError = require("./utils/ExpressError.js");
const{ListingSchema, reviewSchema} = require("./schema.js");
//const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{ 
if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logied in to create listings!");
       return res.redirect("/login");
    }
    next();
};



// module.exports.saveRedirectUrl = (req,res,next)=>{
// if( req.session.redirectUrl){
//     res.locals.redirectUrl = req.session.redirectUrl;
// }
// next();
// };

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.method==='GET' && req.originalUrl){
        req.session.redirectUrl = req.originalUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
      let{ id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not a Owner of this listing");
       return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports. validateListing = (req,res,next) =>{
    let {error} = ListingSchema.validate(req.body);
     
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
     
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isreviewAuthor = async (req,res,next)=>{
      let{ id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
        {
        req.flash("error","you did not creat a review");
       return res.redirect(`/listings/${id}`);
    }

    next();
};