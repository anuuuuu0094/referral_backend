const Candidate = require('../models/condidate');
const { CANDIDATE_STATUS } = require('../config/constant');

class MetricsController {
    async getMetrics(req, res, next) {
        try {
            const total = await Candidate.countDocuments();
            
            const byStatus = await Candidate.aggregate([
                { 
                    $group: { 
                        _id: '$status', 
                        count: { $sum: 1 } 
                    } 
                },
                { $sort: { _id: 1 } }
            ]);

            // Ensure all statuses are represented
            const statusMap = {
                [CANDIDATE_STATUS.PENDING]: 0,
                [CANDIDATE_STATUS.REVIEWED]: 0,
                [CANDIDATE_STATUS.HIRED]: 0
            };

            byStatus.forEach(item => {
                statusMap[item._id] = item.count;
            });

            const formattedByStatus = Object.keys(statusMap).map(status => ({
                status,
                count: statusMap[status]
            }));

            // Get recent candidates (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentCandidates = await Candidate.countDocuments({
                createdAt: { $gte: sevenDaysAgo }
            });

            // Get top job titles
            const topJobTitles = await Candidate.aggregate([
                { $group: { _id: '$jobTitle', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            res.json({
                success: true,
                data: {
                    total,
                    byStatus: formattedByStatus,
                    recentCandidates,
                    topJobTitles,
                    averagePerDay: total > 0 ? (total / 30).toFixed(2) : 0 // Average over last 30 days
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MetricsController();