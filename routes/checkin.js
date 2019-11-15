exports.checkin = async (req, res) => {
    req.session.lastCheckinTime = Date.now();
};