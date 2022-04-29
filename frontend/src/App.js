import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
function App() {
	return (
		<div className='App'>
			<Route exact path='/' component={HomePage}></Route>
			<Route path='/chat' component={ChatPage}></Route>
		</div>
	);
}

export default App;
