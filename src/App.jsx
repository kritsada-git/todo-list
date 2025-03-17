import {useState, useEffect} from 'react'
import './App.css'
import api from "./api.js";
import { Routes, Route, Link } from "react-router-dom";
import Todopage from "./pages/todopage.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";

function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/tasks" element={<Todopage />} />
				<Route path="/regis" element={<Register />} />
			</Routes>
		</div>
	);
}

export default App;