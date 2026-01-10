const Candidate = require('../models/condidate');
const fileService = require('../services/fileService');
const { CANDIDATE_STATUS } = require('../config/constant');

class CandidateController {
    // Get all candidates with search and filter
    async getCandidates(req, res, next) {
        try {
            const { search, status } = req.query;
            let query = {};

            if (search) {
                query.$or = [
                    { jobTitle: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } }
                ];
            }

            if (status && status !== 'All') {
                query.status = status;
            }

            const candidates = await Candidate.find(query)
                .sort({ createdAt: -1 })
                .select('-__v');

            res.json({
                success: true,
                count: candidates.length,
                data: candidates
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single candidate by ID
    async getCandidateById(req, res, next) {
        try {
            const candidate = await Candidate.findById(req.params.id);
            
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate not found'
                });
            }

            res.json({
                success: true,
                data: candidate
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new candidate
    async createCandidate(req, res, next) {
        try {
            const { name, email, phone, jobTitle } = req.body;
            
            const candidateData = {
                name,
                email,
                phone,
                jobTitle,
                status: CANDIDATE_STATUS.PENDING
            };

            if (req.file) {
                candidateData.resumeUrl = `/uploads/${req.file.filename}`;
            }

            const candidate = await Candidate.create(candidateData);
            
            res.status(201).json({
                success: true,
                message: 'Candidate created successfully',
                data: candidate
            });
        } catch (error) {
            next(error);
        }
    }

    // Update candidate status
    async updateCandidateStatus(req, res, next) {
        try {
            const { status } = req.body;
            
            const candidate = await Candidate.findByIdAndUpdate(
                req.params.id,
                { status },
                { 
                    new: true,
                    runValidators: true 
                }
            );

            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate not found'
                });
            }

            res.json({
                success: true,
                message: 'Candidate status updated successfully',
                data: candidate
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete candidate
    async deleteCandidate(req, res, next) {
        try {
            const candidate = await Candidate.findById(req.params.id);
            
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate not found'
                });
            }

            // Delete resume file if exists
            if (candidate.resumeUrl) {
                await fileService.deleteFile(candidate.resumeUrl);
            }

            await candidate.deleteOne();

            res.json({
                success: true,
                message: 'Candidate deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Update candidate (full update)
    async updateCandidate(req, res, next) {
        try {
            const updates = req.body;
            
            // Remove status from updates if present (use separate endpoint)
            delete updates.status;

            const candidate = await Candidate.findByIdAndUpdate(
                req.params.id,
                updates,
                { 
                    new: true,
                    runValidators: true 
                }
            );

            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate not found'
                });
            }

            res.json({
                success: true,
                message: 'Candidate updated successfully',
                data: candidate
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CandidateController();