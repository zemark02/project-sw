const Booking = require('../models/Booking')
const Hotel = require('../models/Hotel')

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Private
exports.getBookings = async (req,res,next)=>{

    let query;
    //General users can see only their bookings
    if(req.user.role !== 'admin'){
        query = await Booking.find({user:req.user.id}).populate({
            path:"hotel",
            select:"name address district province postalcode tel"
        })
        res.status(200).json({success:true,count:query.length,data:query})
    }else{//If you are an admin, you can see all!
        
        query=Booking.find().populate({
            path:'hotel',
            select: 'name address district province postalcode tel'
        });

        //Pagination
        const page = parseInt(req.query.page,10) || 1;
        let limit = parseInt(req.query.limit,10) || 25;
        
        if(limit && limit > 100){
            limit = 100
        }

        const startIndex = (page-1)*limit;
        const endIndex = page*limit

        try{
            const total = await Booking.countDocuments();
    
            query = query.skip(startIndex).limit(limit);
            //Execute query
            const booking = await query;
    
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
    
            res.status(200).json({success:true,count:booking.length,data:booking})
        }catch(err){
            console.log(err);
            res.status(400).json({success:false})
        }
    }
        
}

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path:"hotel",
            select:"name address district province postalcode tel"
        })

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`})
        }

        res.status(200).json({success:true,data:booking});
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find booking"})
    }

    
}

//@desc Create single bookings
//@route GET /api/v1/hotels/:hotelId/bookings
//@access Private

exports.addBooking = async (req,res,next)=>{
    try{
        
        req.body.hotel = req.params.hotelId
        req.body.user = req.user.id

        const bookingDate = new Date(req.body.bookingDate)
        const currentDate = new Date(Date.now())
    

        if(!bookingDate || bookingDate < currentDate){
            return res.status(404).json({success:false,message:`Invalid bookingDate`})
        }
        
        const hotel = await Hotel.findById(req.params.hotelId)

        if(!hotel){
            return res.status(404).json({success:false,message:`No hotel with id  of ${req.params.hotelId}`})
        }

        //add user Id to req.body
        //req.body.user = req.user.id
        // req.body.user = req.user.id

        const existedBooking = await Booking.find({user:req.user.id})

        if(existedBooking.length >= 3){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has been booked more than 3 nights`})

        }

        const booking = await (await Booking.create(req.body)).populate({
            path:'hotel',
            select:"name address district province postalcode tel"
        });
        return res.status(200).json({success:true,data:booking})
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot create booking"})
    }
}


//@desc Update single bookings
//@route Patch /api/v1/bookings/:id
//@access Private
exports.updateBooking =  async (req,res,next)=>{
    try{
        let booking = await Booking.findById(req.params.id)


        if(!booking){
            return res.status(400).json({success:false,message:`No booking with id ${req.params.id}`})
        }

        if(booking.user.toString() !== req.user.id && req.user.role != "admin"){
            
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorize to update this booking`})
        }

        const bookingDate = new Date(req.body.bookingDate)
        const currentDate = new Date()

        if(!bookingDate || bookingDate < currentDate){
            return res.status(404).json({success:false,message:`Invalid bookingDate`})
        }

        booking = await  (await Booking.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})).populate({
            path:'hotel',
            select:"name address district province postalcode tel"
        })
        res.status(200).json({success:true,data:booking})


    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false ,message:"Cannot update Booking"})
    }
}


//@desc Delete single bookings
//@route Delete /api/v1/bookings/:id
//@access Private
exports.deleteBooking =  async (req,res,next)=>{
    try{
        let booking = await Booking.findById(req.params.id)

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with id ${req.params.id}`})
        }

        if(booking.user.toString() !== req.user.id && req.user.role !== "admin"){
            return res.status(401).json({success:false,message:`User ${req.user.is} is not authorized to delete this booking`})
        }

        await booking.remove();
        res.status(200).json({success:true,data:{}})
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false ,message:"Cannot delete Booking"})  
    }
}
