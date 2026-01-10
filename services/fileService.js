const fs = require('fs').promises;
const path = require('path');

class FileService {
    constructor(uploadDir = 'uploads') {
        this.uploadDir = uploadDir;
    }

    async deleteFile(filePath) {
        try {
            const fullPath = path.join(__dirname, '..', '..', filePath);
            await fs.unlink(fullPath);
            return true;
        } catch (error) {
            // File might not exist, which is okay
            if (error.code !== 'ENOENT') {
                console.error('Error deleting file:', error);
            }
            return false;
        }
    }

    async ensureUploadDirExists() {
        try {
            await fs.access(this.uploadDir);
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }

    getFilePath(filename) {
        return `/${this.uploadDir}/${filename}`;
    }
}

module.exports = new FileService();