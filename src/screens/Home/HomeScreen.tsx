import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';


const HomeScreen: React.FC = () => {


	return (
		<View style={styles.container}>
			<Text style={styles.title}>🏠 Welcome to Home Screen! 🤪</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fffbe7',
		padding: 20,
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#f59e42',
		textAlign: 'center',
	}
});

export default HomeScreen;
