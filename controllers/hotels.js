// const Appointment = require('../models/Appointment');
const Hotel = require('../models/Hotel')





exports.getHotels = async(req,res,next)=>{
    let query;

    //Copy req.query 
   
    const reqQuery = {...req.query};
    const removeFields = ["select","sort","page","limit"];
   

    //loop over remove fields and   delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    console.log(removeFields);
    //Create query string

    let queryStr = JSON.stringify(reqQuery);
 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
    query =  Hotel.find(JSON.parse(queryStr))
       console.log(queryStr);

    //Select Feilds
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);

    }

    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }else{
 
        query = query.sort('-createAt');
    }

    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    let limit = parseInt(req.query.limit,10) || 25;
    
    if(limit && limit > 100){
        limit = 100
    }

    const startIndex = (page-1)*limit;
    const endIndex = page*limit
    
    try{
        const total = await Hotel.countDocuments();

        query = query.skip(startIndex).limit(limit);
        //Execute query
        const hotels = await query;

        //Pagination result
        const pagination = {};
        if(endIndex < total){
            pagination.next = {
                page : page+1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true,count:hotels.length,data:hotels})
    }catch(err){
        console.log(err);
        res.status(400).json({success:false})
    }
    
}

exports.getHotel = async(req,res,next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id)
  
        if(!hotel){
            res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:hotel})
    }catch(err){
        console.log(err);
        res.status(400).json({success:false})
    }
    
}

// ------- not available in the functional requirement -------------------

// exports.createHotel = async(req,res,next)=>{
//     console.log(req.body);
//     const hotel = await Hotel.create(req.body);
//     res.status(201).json({success:true,data:hotel })
// }

// exports.updateHotel = async(req,res,next)=>{
//     try{
//         const updateHotel = await Hotel.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true
//         })

//         if(!updateHotel){
//             res.status(400).json({success:false})
//         }

//         res.status(200).json({success:true,data:updateHotel})

//     }catch(err){
//         res.status(400).json({success:false})
//     }
    
// }

// exports.deleteHotel = async(req,res,next)=>{
//     try{
//         const hotel = await Hotel.findById(req.params.id)
//         if(!hotel){
//             res.status(400).json({success:false})
//         }
//         hotel.remove();
//         res.status(200).json({success:true,data:{}})
//     }catch(err){
//         console.log(err);

//         res.status(400).json({success:false})
//     }
// }


