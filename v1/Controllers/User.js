const Model = require("../../model");

const { authenticate: Auth } = require("../../common");

module.exports.register = async (req, res, next) => {
    try {
        

        if (req.body.email) {
            const emailUser = await Model.User.findOne({ email: req.body.email });
            if (emailUser){
               return res.json({
                    statusCode: 200,
                    message: "EMAIL_ALREADY_EXISTS",
    
                })
            } 
        }

        if (req.body.phoneNo) {
            const userData = await Model.User.findOne({ phoneNo: req.body.phoneNo });

            if (userData){
              return  res.json({
                    statusCode: 200,
                    message: "PHONE_NUMBER_ALREADY_EXISTS",
    
                })
            } 
        }

        const user = await Model.User.create(req.body);
        await user.setPassword(req.body.password);
        await user.save();
        
        return res.json({
            statusCode: 200,
            message: "USER_REGISTER_SUCCESSFULLY",
            data: user,
        })
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        let user = null;

        if (req.body.email) {
            user = await Model.User.findOne({ email: req.body.email })
        }  else if (req.body.phoneNo) {
            user = await Model.User.findOne({  phoneNo: req.body.phoneNo });
        }

        if (!user){
          return  res.json({
                statusCode: 200,
                message: "USER_NOT_FOUND",       
               
            })
        }
        await user.authenticate(req.body.password);

        user.accessToken = await Auth.getToken({ _id: user._id });
    
        await user.save();
      
        return res.json({
            statusCode: 200,
            message: "USER_LOGIN_SUCCESSFULLY",
            data: user,
        })
       
    } catch (error) {
        return res.json({
            statusCode: 404,
            message: "INVALID_PASSWORD OR EMAIL",
        })
    }
};
module.exports.changePassword = async (req, res, next) => {
    try {

        const doc = await Model.User.findOne({ _id: req.user._id });

        await doc.authenticate(req.body.oldPassword);
        await doc.setPassword(req.body.newPassword);
        await doc.save();

        return res.json({
            statusCode: 200,
            message: "PASSWORD_CHANGED_SUCCESSFULLY",
           
        })
    } catch (error) {
        if (error.message === "INVALID_PASSWORD") {
            return res.json({
                statusCode: 404,
                message: "CURRENT_PASSWORD_IS_WRONG",
               
            })
           
        }
        next(error);
    }
};
module.exports.sendOtpForgot = async (req, res, next) => {
    try {
        let user = null;

        if (req.body.email) {
            user = await Model.User.findOne({ email: req.body.email });
        }  else if (req.body.phoneNo) {
            user = await Model.User.findOne({ phoneNo: req.body.phoneNo });
        }

        if (!user){
           return res.json({
                statusCode: 200,
                message: "USER_NOT_FOUND",       
               
            })
        }
    

        const oneTimeCode = "123456"   // currently i m using static
        user.oneTimeCode = oneTimeCode;
        await user.save();
        
        return res.json({
            statusCode: 200,
            message: "OTP_SENT_SUCCESSFULLY   || THIS IS DEMO PLZ VERIFY OTP 123456",       
           
        })
       
    } catch (error) {
        next(error);
    }
};
module.exports.verifyOtp = async (req, res, next) => {
    try {
        let user = null;

        if (req.body.email) {
            user = await Model.User.findOne({ email: req.body.email });
        }  else if (req.body.phoneNo) {
            user = await Model.User.findOne({  phoneNo: req.body.phoneNo });
        }

        if (!user){
           return res.json({
                statusCode: 200,
                message: "USER_NOT_FOUND",       
               
            })
        } 
        

        if (req.body.otpCode != user.oneTimeCode){
            return res.json({
                statusCode: 200,
                message: "INVALID_OTP",       
               
            })
        } 
        user.oneTimeCode = "";
        user.accessToken = await Auth.getToken({ _id: user._id });

        await user.save();
        return res.json({
            statusCode: 200,
            message: "OTP_VERIFIED",       
           data:user
        })
    } catch (error) {
       return res.json({
            statusCode: 404,
            message: "INVALID_OTP",       
           
        })
    }
};

module.exports.resetPassword = async (req, res, next) => {
    try {

        const doc = await Model.User.findOne({ _id: req.user._id });
        await doc.setPassword(req.body.newPassword);
        await doc.save();

        return res.json({
            statusCode: 200,
            message: "PASSWORD_CHANGED_SUCCESSFULLY",
           
        })
    } catch (error) {
        return res.json({
            statusCode: 404,
            message: "INVALID_OTP", 
            data:error      
           
        })
    }
};