module.exports = AppUser => {
  AppUser.banUser = async (isBanned, userId) => {
    // Get the user to be banned
    const bannedUser = await AppUser.findById(userId);
    if (bannedUser) {
      // Mark the user as 'isBanned'
      bannedUser.isBanned = isBanned;
      await bannedUser.save();
      // Delete all access tokens of this user, forcing him/her to log out
      await AppUser.app.models.AccessToken.destroyAll({ userId });
    }
  };

  AppUser.remoteMethod('banUser', {
    accepts: [
      { arg: 'isBanned', type: 'boolean' },
      { arg: 'userId', type: 'string' },
    ],
    http: { verb: 'post' },
  });
};
