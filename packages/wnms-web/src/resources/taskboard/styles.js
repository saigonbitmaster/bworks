export const styles = () => ({
  container: {
    margin: '.5em 0',
    padding: '0 .5em',
  },
  frame: {
    padding: '0 .5em',
  },
  card: {
    width: '100%',
    margin: '.5em 0',
    minHeight: '30em',
    height: '40em',
    maxHeight: '45em',
    textTransform: 'uppercase',
  },
  headerCard: {
    margin: '.5em 1em 0 0',
    height: '50px',
    padding: '.5em',
    textTransform: 'none',
  },
  addHeaderCard: {
    margin: '0 1em',
  },
  hideElement: {
    display: 'none',
  },
  contentCard: {
    overflowY: 'auto',
    height: '35em',
    padding: 0,
  },
  itemCard: {
    position: 'relative',
    padding: '1em 1em 0.5em 1em',
    textTransform: 'none',
    margin: '0 0 .5em 0',
    background: 'rgba(0, 0, 0, 0.08)',
    display: 'block',
    borderRadius: '.3em',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.16)',
    },
    '&:active': {
      background: 'rgba(0, 0, 0, 0.24)',
    },
  },
  creator: {
    position: 'absolute',
    backgroundColor: 'transparent',
    color: '#fff',
    top: '0.1em',
    right: '0.1em',
  },
  dueDate: {
    position: 'absolute',
    backgroundColor: 'transparent',
    margin: '.5em 0 0 0',
    height: '1.5em',
    float: 'right',
    right: 0,
  },
  chiptodo: {
    background: '#FEA500',
    position: 'relative',
    margin: '.5em 0 0 0',
    height: '1.5em',
    color: '#fff',
  },
  chipdoing: {
    background: '#5CB85C',
    position: 'relative',
    margin: '.5em 0 0 0',
    height: '1.5em',
    color: '#fff',
  },
  chipfinish: {
    background: '#4E64CE',
    position: 'relative',
    margin: '.5em 0 0 0',
    height: '1.5em',
    color: '#fff',
  },
  avatar: {
    width: '35px',
    height: '35px',
    backgroundColor: '#42526C',
  },
  fullName: {
    color: '#fff',
    fontSize: '125%',
  },
});

export const taskHistoryStyles = () => ({
  container: {
    // margin: '.5em 0',
    padding: '.5em 0',
  },
  hr: {
    borderTop: '1px solid #B7ACA5',
  },
  card: {
    margin: '.5em 0 .5em 0',
  },
  header: {
    alignItems: 'start',
    margin: '.2em 0 0 0',
    padding: '.5em .5em 0 .5em',
  },
  content: {
    margin: '.5em 0 0 0',
    // margin: 0,
    borderBottom: '1px solid #B7ACA5',
    padding: '0 0 0 4em',
    '&:last-child': {
      paddingBottom: '.5em',
    },
  },
  avatar: {
    position: 'absolute',
  },
  action: {
    margin: '0 1em 0 0',
  },
  editor: {
    margin: '1em 0 0 0',
    fontSize: '0.8em',
    fontFamily: 'sans-serif',
    color: '#ADACAC',
  },
  editorInput: {
    margin: '0',
    padding: '0 0 1em 0',
  },
  timeCreate: {
    marginLeft: '.5em',
    color: '#8B8989',
  },
  // statusTask: {
  //   /* margin: '.5em 0 0 1em',
  //   padding: '0 0 0 1.5em', */
  // },
  // description: {
  //   /* padding: '0 0 0 1.5em', margin: '0 0 0 1em' */
  // },
  commentStatus: {
    width: 'max-content',
    display: 'flex',
  },
  postContent: {
    margin: '.5em 0 0 0',
    // margin: 0,
    borderBottom: '1px solid #B7ACA5',
    padding: '0 0 0 .5em',
    '&:last-child': {
      paddingBottom: '.5em',
    },
  },
});
