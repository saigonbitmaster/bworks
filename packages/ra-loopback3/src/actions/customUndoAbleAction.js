export const CUSTOM_UNDOABLE = 'SF/CUSTOM_UNDOABLE';
// example

export const startCustomUndoable = action => ({
  type: CUSTOM_UNDOABLE,
  payload: { action },
});
// example:
// startCustomUndoable({
//   type: 'RESTORE_PIPE_TO_STOCK',
//   payload: async () => {
//     // todo somthing
//     return {}; // {error, data}
//   },
//   meta: {
//     // incase delete data
//     deleteData: { resource: 'materialuses', ids: []}, // or ids if delete many
//     onSuccess: {
//       notification: {
//         body: 'ra.notification.deleted',
//         level: 'info',
//         messageArgs: {
//           smart_count: ids.length,
//         },
//       },
//     },
//     onFailure: {
//       notification: {
//         body: 'ra.notification.http_error',
//         level: 'warning',
//       },
//     },
//   },
// });
