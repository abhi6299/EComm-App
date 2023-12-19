import { UserModel } from "../features/user/user.model.js";
const basicAuthorizer = (req,res,next) =>{
    console.log(req.headers);
    console.log(req.header);
    //1. Check if authorization header is empty
    // const authHeader = req.header("authorization"); 
    //OR
    const authHeader = req.headers['authorization']; // More accurate way than above
    if(!authHeader){
        return res.status(401).send('No authorization details found');
    }
    console.log(authHeader);
    //2. Extarct credential, Encrypted data will be present in the form- [Basic wertyuiopwertyuiop]
    const base64credentials = authHeader.replace('Basic ','');// Extract the encoded part
    console.log(base64credentials);

    //3. Decode credentials
    const decodeCreds = Buffer.from(base64credentials,'base64').toString('utf8');
    console.log(decodeCreds); // Decode cred will be in the form [Username:Password]
    const creds = decodeCreds.split(':'); // created array out of the above decode format data

    const user = UserModel.getAll().find(u =>(u.email == creds[0] && u.password == creds[1]));
    if(user){
        next(); // calling the next middle ware in the pipeline
    }
    else{
        res.status(401).send('Incorrect credentials bro');
    }
}
export default basicAuthorizer;
