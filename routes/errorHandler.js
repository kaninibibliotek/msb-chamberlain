

// This middleware is invoked if next(err) is called
module.exports = function errorHandler(err, req, res, next) {
  console.error('Error', err.stack);

  // TODO: Not tested!
  if (req.xhr) {
    res.status(500);
    res.render('error', { error: err });
  }
}
