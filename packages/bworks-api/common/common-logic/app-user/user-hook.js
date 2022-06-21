var path = require('path');

var senderAddress = 'wateroshelp@gmail.com';

module.exports = function(AppUser) {
  //send verification email after registration, custom host and port to use in production with NGINX
  AppUser.afterRemote('create', function(context, user, next) {
    var options = {
      host: process.env.DOMAIN,
      protocol: process.env.EXTERNAL_PROTOCOL || 'http',
      port: process.env.EXTERNAL_PORT || 443,
      text: 'Please activate your account by clicking on this link:\n\t{href}',
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../../views/verify.ejs'),
      redirect: '/',
      user: user,
    };
    user.verify(options, function(err, response) {
      if (err) {
        AppUser.deleteById(user.id);
        return next(err);
      }
      next();
    });
  });

  // Method to render
  AppUser.afterRemote('prototype.verify', function(context, user, next) {
    context.res.render('response', {
      title: 'A Link to reverify your identity has been sent ' + 'to your email successfully',
      content: 'Please check your email and click on the verification link ' + 'before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

  //send password reset link when requested
  AppUser.on('resetPasswordRequest', function(info) {
    var url = process.env.EXTERNAL_PROTOCOL + '://' + process.env.DOMAIN + ':' + process.env.EXTERNAL_PORT + '/cmn/#/setpassword';
    //var url = 'http://localhost:3001/#/setPassword';
    var html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id + '">here</a> to reset your password';

    AppUser.app.models.Email.send(
      {
        to: info.email,
        from: senderAddress,
        subject: 'Password reset',
        html: html,
      },
      function(err) {
        if (err) return
      },
    );
  });
};
