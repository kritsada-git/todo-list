import {useState, useEffect} from 'react'
import '../App.css'
import api from "../api.js";


function App() {
	const [userId, setUserId] = useState();
	const [username, setUsername] = useState();
	const [name, setName] = useState();

	const fetchTokenData = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			console.error("Token not found");
			window.location.href = "/";
			return;
		}

		try {
			const response = await api.post("user/authen", {}, {
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});
			if (response.status === 200 && response.data?.decoded?.id) {
				setUserId(response.data.decoded.id);
				setUsername(response.data.decoded.username);
				setName(response.data.decoded.name);
			}
		} catch (error) {
			console.error("Error:", error.message);
			window.location.href = "/";
		}
	};

	const [tasks, setTasks] = useState([]);

	// Modal state
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState(null);

	useEffect(() => {
		fetchTokenData();
		if (userId) {
			fetchTasks();
		}
	}, [userId]);


	const fetchTasks = async () => {
		try {
			const res = await api.get(`tasks/user/${userId}`);
			setTasks(res.data);
		} catch (err) {
			console.error("Error fetching tasks:", err);
		}
	};

	// State สำหรับเก็บค่าจาก Input
	const [newTask, setNewTask] = useState({
		task: "",
		detail: "",
		start_date: "",
		due_date: "",
		status: "Pending",
	});

	// คำนวณจำนวนวันที่เหลือ
	const calculateDaysLeft = (dueDate) => {
		const today = new Date();
		const due = new Date(dueDate);
		const diffTime = due - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	// ตรวจสอบสถานะของ due date
	const getDueStatus = (dueDate) => {
		const daysLeft = calculateDaysLeft(dueDate);
		if (daysLeft < 0) return {text: "Overdue", color: "text-red-600 font-bold"};
		if (daysLeft === 0) return {text: "Due Today", color: "text-orange-500 font-bold"};
		if (daysLeft <= 2) return {text: "Soon", color: "text-yellow-500 font-bold"};
		return {text: "On Track", color: "text-green-500"};
	};

	// ฟังก์ชันอัพเดตค่าของ Input
	const handleInputChange = (e) => {
		setNewTask({...newTask, [e.target.name]: e.target.value});
	};

	// ฟังก์ชันเพิ่ม Task ลงในตาราง
	const addTask = async () => {
		if (!newTask.task || !newTask.start_date || !newTask.due_date) {
			showAlert("กรุณากรอกข้อมูลให้ครบ!", "error");
			return;
		}

		try {
			newTask.owner = id;
			await api.post("/tasks", newTask);
			showAlert("เพิ่มงานสำเร็จ!", "success");
			fetchTasks();
			clearTask();

		} catch (error) {
			showAlert("ไม่สามารถเพิ่มงานได้!", "error");
		}
		// setNewTask({ task: "", detail: "", start_date: "", due_date: "", status: "Pending" });
	};

	const clearTask = () => {
		setNewTask({task: "", detail: "", start_date: "", due_date: "", status: "Pending" });
	};

	// แสดง modal ยืนยันการลบ
	const confirmDelete = (id) => {
		setTaskToDelete(id);
		setShowDeleteModal(true);
	};

	// ฟังก์ชันลบ Task
	const deleteTask = async () => {
		try {
			await api.delete(`/tasks/${taskToDelete}`);
			setShowDeleteModal(false);
			showAlert("ลบงานสำเร็จ!", "success");
			fetchTasks();
		} catch (error) {
			showAlert("ไม่สามารถลบงานได้!", "error");
		}
	};

	// แสดงข้อความแจ้งเตือน
	const [alert, setAlert] = useState({show: false, message: "", type: ""});
	const showAlert = (message, type) => {
		setAlert({show: true, message, type});
		setTimeout(() => {
			setAlert({show: false, message: "", type: ""});
		}, 3000);
	};

	const handleLogout = () => {
		localStorage.removeItem("token"); // ลบ Token ออกจาก localStorage
		window.location.href = "/"; // กลับไปหน้า Login
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
				<div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
							{userId} {name} : To-Do List
						</h1>
						<div className="text-sm text-gray-500">
							{new Date().toLocaleDateString('th-TH', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
							<button
								onClick={handleLogout}
								className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 text-sm mx-5"
							>
								Log out
							</button>
						</div>

					</div>

					{/* Alert */}
					{alert.show && (
						<div className={`mb-4 p-3 rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
							{alert.message}
						</div>
					)}

					{/* Table */}
					<div className="overflow-x-auto rounded-lg shadow">
						<table className="w-full border-collapse bg-white">
							<thead>
							<tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
								<th className="p-3 text-left rounded-tl-lg">#</th>
								<th className="p-3 text-left">งาน</th>
								<th className="p-3 text-left">รายละเอียด</th>
								<th className="p-3 text-left">วันเริ่ม</th>
								<th className="p-3 text-left">วันสิ้นสุด</th>
								<th className="p-3 text-left">วันที่เหลือ</th>
								<th className="p-3 text-left">สถานะกำหนดส่ง</th>
								<th className="p-3 text-left">สถานะ</th>
								<th className="p-3 text-center rounded-tr-lg">จัดการ</th>
							</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
							{tasks.map((task) => {
								const daysLeft = calculateDaysLeft(task.due_date);
								const dueStatus = getDueStatus(task.due_date);

								return (
									<tr key={task.id} className="hover:bg-gray-50">
										<td className="p-3 text-center">{task.id}</td>
										<td className="p-3 font-medium">{task.task}</td>
										<td className="p-3 text-gray-600">{task.detail}</td>
										<td className="p-3">{task.start_date}</td>
										<td className="p-3">{task.due_date}</td>
										<td className="p-3">{daysLeft} วัน</td>
										<td className={`p-3 ${dueStatus.color}`}>{dueStatus.text}</td>
										<td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
	                                                task.status === "Completed" ? "bg-green-100 text-green-800" :
		                                                task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
			                                                "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                    {task.status}
                                                </span>
										</td>
										<td className="p-3 text-center">
											<button
												onClick={() => confirmDelete(task.id)}
												className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm"
											>
												ลบ
											</button>
										</td>
									</tr>
								);
							})}

							{/* New Task Input Row */}
							<tr className="bg-gray-50">
								<td className="p-3 text-center text-gray-500">#</td>
								<td className="p-3">
									<input
										type="text"
										name="task"
										value={newTask.task}
										onChange={handleInputChange}
										placeholder="ชื่องาน"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</td>
								<td className="p-3">
									<input
										type="text"
										name="detail"
										value={newTask.detail}
										onChange={handleInputChange}
										placeholder="รายละเอียด"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</td>
								<td className="p-3">
									<input
										type="date"
										name="start_date"
										value={newTask.start_date}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</td>
								<td className="p-3">
									<input
										type="date"
										name="due_date"
										value={newTask.due_date}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</td>
								<td className="p-3"></td>
								<td className="p-3"></td>
								<td className="p-3">
									<select
										name="status"
										value={newTask.status}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="Pending">Pending</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
									</select>
								</td>
								<td className="p-3"></td>
							</tr>
							</tbody>
							<tfoot>
							<tr>
								<td colSpan="9" className="p-3 bg-gray-50 rounded-b-lg">
									<div className="flex gap-2">
										<button
											onClick={addTask}
											className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
										>
											เพิ่มงาน
										</button>
										<button
											onClick={clearTask}
											className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md transition duration-200"
										>
											ล้างข้อมูล
										</button>
									</div>
								</td>
							</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 z-50">
					<div className="absolute inset-0 bg-black opacity-50"></div>
					<div className="relative z-10 flex items-center justify-center min-h-screen p-4">
						<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
							<h3 className="text-lg font-bold text-gray-900 mb-4">ยืนยันการลบ</h3>
							<p className="text-gray-600 mb-6">คุณต้องการลบงานนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถเรียกคืนได้</p>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => setShowDeleteModal(false)}
									className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
								>
									ยกเลิก
								</button>
								<button
									onClick={deleteTask}
									className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
								>
									ยืนยันการลบ
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default App;