const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Storage para imágenes de perfil
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile/userProfile');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const randomName = crypto.randomBytes(16).toString('hex');
        cb(null, randomName + ext);
    }
});

// Storage para portadas
const coverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile/userCover');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const randomName = crypto.randomBytes(16).toString('hex');
        cb(null, randomName + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([ '.jpg', '.jpeg', '.png', '.gif' ].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

const uploadProfile = multer({ storage: profileStorage, fileFilter });
const uploadCover = multer({ storage: coverStorage, fileFilter });

module.exports = { uploadProfile, uploadCover };
