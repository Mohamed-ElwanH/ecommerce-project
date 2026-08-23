const multer = require('multer');
const path = require('path');
//you can use MIME for security or seperating uploads from the system
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowed = ['.png', '.jpg', '.jpeg']
    if (!allowed.includes(extension)) {
        return cb(new Error('Only Images allowed'), false) //giving the callback function an error instead of null 
    }
    cb(null,true); //true means pass to the next step
} 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() +'_' +  file.originalname)
    }
})

const MB = 1024 * 1024 //magic number

const upload = multer({
    storage, fileFilter, limits:{fileSize:MB*2} //max file size in bytes
})

module.exports = {upload}