# starting with SHaktiAI
setup both frontend an backend 
starting with backend first 
all connections done 

# backend
## auth services 
- created User.js in models
- making authcontroller for signup and login 
    *signup*
    - an async req,res arrow fnxn
    - save the req.body
    - check if user already exists, if does then set 500 error
    - hash the password using bcrypt add salt 
    - create a new user with hashed password and details
    - save the user
    - send the response
    *login*
    - an async req,res arrow fnxn
    - save the req.body
    - check if user exists using findone(email)
    - if no user then set 400 error
    - compare the password
    - if password doesn t match then set 400 error
    - create a token using jwt.sign
    - send the response with this token and user
- creating middlewares for validation 
    - a validate function (schema)= (req,res,next)=>, using schema.validate
    - signup schema as joi.object
    - login schema as joi.object
    - exporting functions with a name passing each schema 
- create routes for signup and login in auth routes
    - create instance of router express.router
    - create post routes fro signup and login 
    ```js
        router.post('/signup',validateSignup,signup)
    ```
    - export the router
- import router in index.js 
- setup authRoute in index.js

# frontend
## auth services 
- install axios and react router dom
- setup in env vite_baseURL
- make services folder / create axios config file in it
- the authcontext handles all the storage thing directly login , sinup logout fnxn 

# backend
## setting up basic chatbot

### utils/chatbotclient.js
setup model amd invoke response 


### routes/chatbotroutes.js


### controller/chatbotcontroller.js
the main req,res async fnxn wittry catch that takes in user message

# frontend 
## services/chatAPi
the fnxn that sends the message to bot 
an async fnxn with trycatch
makes a post request to chatbot and retur the result.reply 

## component/Chatbot
create handle send fnxn 

## page/home
render the chatbot component here

## routes/chatRoute

