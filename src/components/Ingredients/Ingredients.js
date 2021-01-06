import React, {
	useReducer,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [...currentIngredients, action.ingredient];
		case 'DELETE':
			return currentIngredients.filter((ing) => ing.id !== action.id);
		default:
			throw new Error('Should not get there');
	}
};

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	const { isLoading, error, data, sendRequest } = useHttp();
	// const [userIngredients, setUserIngredients] = useState([]);
	// const [isLoading, setIsloading] = useState(false);
	// const [error, setError] = useState();

	// useEffect(() => {
	// 	fetch(
	// 		'https://react-hooks-update-d979a-default-rtdb.firebaseio.com/ingredients.json'
	// 	)
	// 		.then((response) => response.json())
	// 		.then((responseData) => {
	// 			const loadedIngredients = [];
	// 			for (const key in responseData) {
	// 				console.log('responseData[key].title', responseData[key]);
	// 				loadedIngredients.push({
	// 					id: key,
	// 					title: responseData[key].title,
	// 					amount: responseData[key].amount,
	// 				});
	// 			}
	// 			console.log('loadedIngredients', loadedIngredients);
	// 			setUserIngredients(loadedIngredients);
	// 		});
	// }, []);

	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		// setUserIngredients(filteredIngredients);
		dispatch({
			type: 'SET',
			ingredients: filteredIngredients,
		});
	}, []);

	const addIngredientHandler = useCallback((ingredient) => {
		// setUserIngredients([...ingredient]);
	}, []);

	const removeIngredientHandler = useCallback(
		(ingredientId) => {
			sendRequest(
				`https://react-hooks-update-d979a-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
				'DELETE'
			);
		},
		[sendRequest]
	);

	const clearError = useCallback(() => {
		dispatchHttp({ type: 'CLEAR' });
	}, []);

	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeIngredientHandler}
			/>
		);
	}, [userIngredients, removeIngredientHandler]);

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={loading}
			/>

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
