const httpStatus = require("http-status")
const { UserModel,ProfileModel } = require("../models")
const ApiError = require("../utils/ApiError")
const { generatoken } = require("../utils/Token.utils")
const axios =  require("axios");
class AuthService{

static  async RegisterUser(body){

                // request
                const {email,password,name} = body

                const checkExist = await UserModel.findOne({email})

                if(checkExist){
                    throw new ApiError(400,"User Already Registered")
                    return
                }
                

            const user = await UserModel.create({
                    email,password,name
                })

                const tokend = generatoken(user)
                const refresh_token = generatoken(user,'2d')
                await ProfileModel.create({
                            user:user._id,
                            refresh_token
                })  


                return {
                    msg:"User Registered Successfully",
                    token:tokend
                }    

       }
static  async LoginUser(body){
        const {email,password} = body

                const checkExist = await UserModel.findOne({email})
                if(!checkExist){
                    throw new ApiError(400,"User Not Registered")
                    return
                }

                if(password !==checkExist.password){
                 throw new ApiError(400,"Invalid Password")
                    return
                }
             
   const tokend = generatoken(checkExist) 
              
                return {
                    msg:"User Logged in Successfully",
                    token:tokend
                }    

       }

static  async ProfileService(user){ 

                const checkExist = await UserModel.findById(user).select("name email")
                if(!checkExist){
                    throw new ApiError(400,"User Not Registered")
                    return
                }
              
                return {
                    msg:"Data fetched",
                    user:checkExist
                }    

       }
}

module.exports = AuthService