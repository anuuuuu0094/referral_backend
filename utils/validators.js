const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    // Remove all non-numeric characters except plus sign
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return /^[\+]?[1-9][\d]{0,15}$/.test(cleaned);
};

const validateFileType = (filename, allowedTypes = ['pdf']) => {
    const ext = filename.split('.').pop().toLowerCase();
    return allowedTypes.includes(ext);
};

module.exports = {
    validateEmail,
    validatePhone,
    validateFileType
};