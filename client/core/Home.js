import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { listPublished, listCategories } from './../group/api-group';
import { listEnrolled, listCompleted } from './../enrollment/api-enrollment';
import Typography from '@material-ui/core/Typography';
import auth from './../auth/auth-helper';
import Groups from './../group/Groups';
import Enrollments from './../enrollment/Enrollments';
import Search from './../group/Search';
import Categories from './../group/Categories';

/*
import { listPublished } from './../course/api-course';
import Courses from './../course/Courses';
*/
const useStyles = makeStyles((theme) => ({
	card: {
		width: '90%',
		margin: 'auto',
		marginTop: 20,
		marginBottom: theme.spacing(2),
		padding: 20,
		backgroundColor: '#ffffff'
	},
	extraTop: {
		flexGrow: 1,
		marginTop: theme.spacing(12),
		margin: 50
	},
	title: {
		padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle
	},
	media: {
		minHeight: 400
	},
	gridList: {
		width: '100%',
		minHeight: 200,
		padding: '16px 0 10px'
	},
	tile: {
		textAlign: 'center'
	},
	image: {
		height: '100%'
	},
	tileBar: {
		backgroundColor: 'rgba(0, 0, 0, 0.72)',
		textAlign: 'left'
	},
	enrolledTitle: {
		color: '#efefef',
		marginBottom: 5
	},
	action: {
		margin: '0 10px'
	},
	enrolledCard: {
		backgroundColor: '#616161'
	},
	divider: {
		marginBottom: 16,
		backgroundColor: 'rgb(157, 157, 157)'
	},
	noTitle: {
		color: 'lightgrey',
		marginBottom: 12,
		marginLeft: 8
	}
}));

export default function Home() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated();
	const [ groups, setGroups ] = useState([]);
	const [ enrolled, setEnrolled ] = useState([]);
	const [ categories, setCategories ] = useState([]);

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		listEnrolled({ t: jwt.token }, signal).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setEnrolled(data);
			}
		});
		return function cleanup() {
			abortController.abort();
		};
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		listPublished(signal).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setGroups(data);
			}
		});
		return function cleanup() {
			abortController.abort();
		};
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		listCategories(signal).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setCategories(data);
			}
		});
		return function cleanup() {
			abortController.abort();
		};
	}, []);

	return (
		<div className={classes.extraTop}>
			{auth.isAuthenticated().user && (
				<Card className={`${classes.card} ${classes.enrolledCard}`}>
					<Typography variant='h6' component='h2' className={classes.enrolledTitle}>
						Active Groups
					</Typography>
					{enrolled.length != 0 ? (
						<Enrollments enrollments={enrolled} />
					) : (
						<Typography variant='body1' className={classes.noTitle}>
							No groups available.
						</Typography>
					)}
				</Card>
			)}
			<Card className={classes.card}>
				<Grid item xs={8} sm={8}>
					<Search categories={categories} />
					<Categories categories={categories} />
				</Grid>
			</Card>
			<Card className={classes.card}>
				<Typography variant='h5' component='h2'>
					View All Groups!
				</Typography>
				{groups.length != 0 && groups.length != enrolled.length ? (
					<Groups groups={groups} common={enrolled} />
				) : (
					<Typography variant='body1' className={classes.noTitle}>
						No new groups.
					</Typography>
				)}
			</Card>
		</div>
	);
}
