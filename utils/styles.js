import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    '& a': { color: '#ffffff', marginLeft: 10 },
  },
  main: { minHeight: '80vh' },
  brand: { fontWeight: 'bold', fontSize: '1.4em' },
  footer: { padding: 10, textAlign: 'center' },
  grow: { flexGrow: 1 },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },
  navbarButton: {
    color: 'white',
    textTransform: 'initial',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  reviewForm: {
    maxWidth: 800,
    width: '100%',
  },
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
});

export default useStyle;
