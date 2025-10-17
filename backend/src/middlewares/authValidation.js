import Joi from 'joi'

const validate = (schema) => (req,res,next) =>{
    const { error } = schema.validate(req.body);
    if(error){
        console.log("error in validation", error);
        return res.status(400)
        .json({
            message: "Bad Request",
            error
        })
    }

    next();
}

const signUpSchema =  Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 3 characters long'
        })
});

// Define the validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(100).required().messages({
            'string.min': 'Password must be at least 3 characters long'
        }),
});


// Export the middleware functions
export const validateSignUp = validate(signUpSchema);
export const validateLogin = validate(loginSchema);
