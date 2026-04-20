const Community = require("../models/Community");

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const loadCommunity = async(req,res,next) => {
  const id = req.params.id;
  const community = await Community.findById(id);
  console.log(id);
  if(!community){
    return res.status(404).json({message: "Community not found"});
  }
  req.community = community;
  next();
}
module.exports = { requireAuth, requireAdmin , loadCommunity };
