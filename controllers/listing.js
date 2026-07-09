const Listing = require("../model/listing");
module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


module.exports.renderNewForm =(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing =  async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id)
      .populate({path:"reviews",
        populate:{
            path:"author",
        },
      })
      .populate("owner");
      console.log(listing);
   if(!listing){
    req.flash("error","listing you requested does not exist!");
  return res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs",{listing});
};

// async function getCoordinates(address){
//        const url=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
//     const response = await fetch(url),
//            headers:{'user-Agent':'Mozila/5.0'}
//         });
//       const data = await response.json();

// console.log("API response:",data);
// if(data && data.length>0){
//     return
//     [parseFloat(data[0].lot),
// parseFloat(data[0].lon)];
// }   
//   //default:ranchi coordinates
//   return[85.3096,23.441];
// }

module.exports.postListing= async (req,res,next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
   
    const location = req.body.listing.location;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)},&format=json&limit=1`,{
        headers:{
            'User-Agent':'MyMajorProject/1.0(abhiraj@gmail.com)'
        }
    });
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data= await response.json();
    console.log(location);
    console.log(data);
    if(data.length>0){
        newListing.geometry={
            type:"Point",
            coordinates:[parseFloat(data[0].lon),
                       parseFloat(data[0].lat)],
        };
    }
    await newListing.save();
    req.flash("sucess","new listing created!");
    res.redirect("/listings");
};
   
//    let url= req.file.path;
//    let filename= req.file.filename;
//    console.log(url,"..",filename);
//    const newListing= new Listing(req.body.listing);
//    newListing.owner = req.user._id;
//    newListing.image = {url:url,filename:filename};
//    await newListing.save();
//    req.flash("success","new listing created!");
//    res.redirect("/listings");
//     };

    module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error","listing you requested does not exist!");
    res.redirct("/listing");
   }

   let originalImageUrl = listing.image.url
   originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");

    res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing = async(req,res) =>{
        let{id}=req.params;
        console.log("Receivec ID:",id);
   let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
   let newLocation = req.body.listing.location;
   
    
    req.flash("success","new listing updated");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req,res)=> {
    let { id } = req.params ;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","new listings deleted");
    res.redirect("/listings");
};