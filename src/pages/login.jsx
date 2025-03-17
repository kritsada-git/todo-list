import {useState, useEffect} from 'react'
import '../App.css'
import api from "../api.js";


function App() {

	const [formData, setFormData] = useState({
		username: '',
		pass: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');



		try {
			// console.log(formData)
			// Call your API here
			const response = await api.post("user/login", formData);
			console.log(response);
			const data = await response.data;
			console.log(data);

			if (data.status != 200) {
				throw new Error(data.message || 'Login failed');
			}

			// Handle successful login
			console.log('Login successful', data);
			// Redirect or store token in localStorage
			localStorage.setItem('token', data.token);

			// Redirect to dashboard or home page
			window.location.href = '/tasks';
		} catch (err) {
			setError(err.message || 'Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
					</div>

					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{error}</span>
						</div>
					)}

					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<input type="hidden" name="remember" value="true"/>
						<div className="rounded-md shadow-sm -space-y-px">
							<div>
								<label htmlFor="email-address" className="sr-only">Email address</label>
								<input
									id="username"
									name="username"
									type="text"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Email address"
									value={formData.username}
									onChange={handleChange}
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">Password</label>
								<input
									id="pass"
									name="pass"
									type="password"
									autoComplete="current-password"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Password"
									value={formData.pass}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
									Forgot your password?
								</a>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								{isLoading ? (
									<span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
								) : (
									<span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </span>
								)}
								{isLoading ? 'Signing in...' : 'Sign in'}
							</button>
						</div>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{' '}
							<a href="/regis" className="font-medium text-indigo-600 hover:text-indigo-500">
								Register now
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;