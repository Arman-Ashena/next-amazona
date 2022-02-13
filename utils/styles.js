import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
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
  toolbar: {
    justifyContent: 'space-between',
  },
  mt1: {
    marginTop: '1rem',
  },
  //search
  searchSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: { display: 'flex' },
  },
  searchForm: {
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  iconButton: {
    backgroundColor: '#f8c040',
    padding: 5,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },
  menuButton: {
    padding: 0,
  },
  fullWidth: {
    width: '100%',
  },
  sort: {
    marginRight: 5,
  },
}));

export default useStyle;
