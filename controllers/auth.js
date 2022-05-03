const User = require("../models/User");
exports.register = async (req, res, next) => {

  try {
    let { name, email, password,tel } = req.body;

    const number = ['0','1','2','3','4','5','6','7','8','9']
    let check = true
    const splitTel = [...tel]

    splitTel.forEach(e=>{
      if(!number.includes(e)) check = false
    })

    if(!check || splitTel.length != 10){
      res.status(400).json({success:false,message:"Invalid Tel"})
    }

    tel = splitTel.slice(0,3).join('') + "-" + splitTel.slice(3,).join('')

    const user = await User.create({
      name:name,
      email:email,
      password:password,
      tel:tel
    });

    return res.status(200).json({success:true,msg:"User created successfully"})
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.logout=async(req,res,next)=>{
  res.cookie('token','none',{
    
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
  })

  res.status(200).json({
    success:true,
    data:{}
  })
}

exports.login = async (req,res,next)=>{
  
  try{

    const {email,password} = req.body;

    if(!email || !password){
      return res.status(400).json({success:true,msg:"Please provide an email and password"});
    }
    
    const user = await User.findOne({email:email}).select('+password');


    if(!user){
      return res.status(400).json({success:false,msg:"Invalid credentials"});
    }

    const isMatch = await user.matchPassword(password)

    if(!isMatch){
      return res.status(401).json({success:false,msg:"Invalid credentials"})
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token})
    sendTokenResponse(user,200,res);
  }catch(err){
    return res.status(401).json({success:false, msg:'Cannot convert email or password to string'});
  }
}

const sendTokenResponse = (user,statusCode,res)=>{
  const token = user.getSignedJwtToken();

  const options = {
    expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
    httpOnly:true
  }

  if(process.env.NODE_ENV == "production"){
    options.secure = true;
  }

  res.status(statusCode).cookie('token',token,options).json({success:true,token})
}

exports.getMe = async (req,res,next)=>{
  const user = await User.findById(req.user.id)
  res.status(200).json({success:true,data:user})
}