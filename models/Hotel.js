const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        unique:true
    },
    address:{
        type:String,
        required:[true,"Please add an address"]
    },
    district:{
        type:String,
        required:[true,"Please add a district"]
    },
    province:{
        type:String,
        require:[true,"Please add a province"]
    },
    postalcode:{
        type:String,
        required:[true,"Please add a postalcode"],
        maxlength:[5,"Postal code can not be more than 5 digits"]
    },
    tel:{
        type:String,
        required:[true,"Please specify a telephone number"],
        minlength:10,
        
    },
})

module.exports = mongoose.model("Hotel",HotelSchema)

