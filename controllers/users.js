const User = require("../model/user")


module.exports.renderSingupForm =(req,res)=>{
    res.render("users/signup");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email,username});
   const registeredUser = await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
    return next(err);
   }
   req.flash("success","user was registerd succesfully");
   res.redirect("/listings");

   });
}catch(e) {
    req.flash("error",e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
        req.flash("success"," you are logedin");
        
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
        console.log("login successful,redirect to:",res.locals.redirectUrl);
        console.log(redirectUrl);

};

module.exports.logout = (req,res,next)=>{
       req.logout((err)=>{
        if(err){
            return next (err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
       });
}