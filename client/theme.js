import { createMuiTheme } from '@material-ui/core/styles';
import { teal, orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#31aee2',
			main: '#86BACF',
			dark: '#97c2d4',
			contrastText: '#fff'
		},
		secondary: {
			light: '#ffad42',
			main: '#f57c00',
			dark: '#bb4d00',
			contrastText: '#fffde7'
		},
		openTitle: '#455a64',
		protectedTitle: '#f57c00',
		type: 'light'
	}
});

export default theme;
