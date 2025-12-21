const multer=require("multer")
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder: 'campus-olx-items',
        allowed_formats: ['jpg','png','jpeg']
    }
});

const upload = multer({storage})
module.exports=upload   