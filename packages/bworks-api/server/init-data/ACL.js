module.exports = [
  {
    id: '1a1a1a1a1a1a1a1a1a101000',
    model: '*',
    property: '*',
    accessType: '*',
    permission: 'DENY',
    principalType: 'ROLE',
    principalId: '$everyone',
  },
  {
    id: '1a1a1a1a1a1a1a1a1a101001',
    model: '*',
    property: '*',
    accessType: '*',
    permission: 'ALLOW',
    principalType: 'ROLE',
    principalId: 'master',
  },
  {
    id: '1a1a1a1a1a1a1a1a1a101002',
    model: 'AppUser',
    property: '*',
    accessType: '*',
    permission: 'ALLOW',
    principalType: 'ROLE',
    principalId: 'master',
  },
  {
    id: '1a1a1a1a1a1a1a1a1a101004',
    model: 'AppUser',
    property: 'resetUserPassword',
    accessType: '*',
    permission: 'ALLOW',
    principalType: 'ROLE',
    principalId: '$unauthenticated',
  },

  // For wctm-client
  {
    id: '1a1a1a1a1a1a1a1a1a101003',
    model: 'ClientUser',
    property: 'requestToCreateNewAccount',
    accessType: '*',
    permission: 'ALLOW',
    principalType: 'ROLE',
    principalId: '$unauthenticated',
  },
];
