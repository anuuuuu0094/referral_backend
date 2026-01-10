const upload = require('../config/multer.config');

const handleFileUpload = (fieldName = 'resume') => {
    return upload.single(fieldName);
};

module.exports = handleFileUpload;
