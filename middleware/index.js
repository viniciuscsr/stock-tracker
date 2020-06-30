const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/login');
};

// check if the user logged in owns the portifolio

middlewareObj.portifolioOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.params.userId == req.user.id) {
      return next();
    } else {
      return res.json({ message: "You're not the owner of this portifolio" });
    }
  } else {
    res.redirect('/user/login');
  }
};

module.exports = middlewareObj;
