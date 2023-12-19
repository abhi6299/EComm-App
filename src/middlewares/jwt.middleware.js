import jwt from 'jsonwebtoken';

const jwtAuth = (req,res,next) => {
    //Read the token
        //Since headers is an arrays of req obj so --
    const token = req.headers["authorization"]; // THis is more standard way of doing it than below
    //OR
    //const token = req.header('authorization'); 
    //If not present handle
    if(!token){
        return res.status(401).send('Unauthorized, bhai auth token to set kar pehle from server and fhir req bhj, aise thodi access milega restricted pages ka');
    }
    //If present , check if its valid
    try{
        const payload=jwt.verify(
            token,'U2oxseR9YUbXc7JchRtObLh36mATbCaS'
        );
        req.userID = payload.userID;
        console.log(payload); 
    }catch(err){
        return res.status(401).send('Unauthorized access for the user');
    }
    // --
    next();
}

export default jwtAuth;