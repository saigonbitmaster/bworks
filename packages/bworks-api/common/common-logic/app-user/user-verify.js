module.exports = function(AppUser) {
AppUser.beforeRemote( "*.verify", function( ctx, modelInstance, next) {
  //...
  console.log("veriy")
  next();
});
}