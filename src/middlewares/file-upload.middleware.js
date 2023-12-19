import multer from "multer";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename: (req,file,cb) => {
        // cb(null,new Date().toISOString()+'_'+file.originalname); //-> will work for all except window as it adds : in the filename which is not allowed in windows
        //Or --
        // cb(null,Date.now() + '-' + file.originalname);
        //Or -- for windows compatibility as well can use below code - see pdf for the issue in window because of ':'
         cb(null,new Date().toISOString().replace(/:/g, '_') + file.originalname);
    }
});

export const upload = multer({storage:storage})