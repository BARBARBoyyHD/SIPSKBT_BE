const validateCSRF = async (req, res, next) => {
    try {
      const CSRF = req.cookies["CSRF-TOKEN"];
      if (!CSRF) {
        return res.status(403).json({
          message: "access denied",
        });
      }
      next()
    } catch (error) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  };
  
  module.exports = validateCSRF