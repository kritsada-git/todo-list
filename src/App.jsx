import { useState , useEffect } from 'react'
import './App.css'
import api from "./api.js";


function App() {
    const [tasks, setTasks] = useState([
        { id: 1, task: "Sample Task", detail: "Example", start_date: "2024-03-16", due_date: "2024-03-20", status: "Pending" }
    ]);

    useEffect(() => {
        api.get("/tasks")
            .then((res) => setTasks(res.data))
            .catch((err) => console.error("Error fetching tasks:", err));
    }, []);

    // State สำหรับเก็บค่าจาก Input
    const [newTask, setNewTask] = useState({
        task: "",
        detail: "",
        start_date: "",
        due_date: "",
        status: "Pending"
    });

    // ฟังก์ชันอัพเดตค่าของ Input
    const handleInputChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    // ฟังก์ชันเพิ่ม Task ลงในตาราง
    const addTask = () => {
        if (!newTask.task || !newTask.start_date || !newTask.due_date) return alert("กรุณากรอกข้อมูลให้ครบ!");
        setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
        // รีเซ็ต Input
        setNewTask({ task: "", detail: "", start_date: "", due_date: "", status: "Pending" });
    };

    const clearTask = () => {
        setNewTask({ task: "", detail: "", start_date: "", due_date: "", status: "Pending" });
    }

  return (
    <>
        <div className="absolute w-screen top-0 left-0 h-screen p4">
            <h1 className="text-black mx-7 my-3"><span className="m-0 p-0 text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-600">To-Do List</span></h1>
            <table className="w-39/40 mx-auto border-separate border-spacing-1">
                <thead>
                <tr className="main-column">
                    <th className="rounded-tl-2xl">ID</th>
                    <th>Task</th>
                    <th>Detail</th>
                    <th>Start Date</th>
                    <th>Due Date</th>
                    <th>Days Left</th>
                    <th>Due Status</th>
                    <th>Status</th>
                    <th className="rounded-tr-2xl">Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task, index) => (
                    <tr key={task.id}>
                        <td className="p-2 text-center">{task.id}</td>
                        <td className="p-2">{task.task}</td>
                        <td className="p-2">{task.detail}</td>
                        <td className="p-2">{task.start_date}</td>
                        <td className="p-2">{task.due_date}</td>
                        <td></td>
                        <td></td>
                        <td className="p-2">{task.status}</td>
                        <td className="p-2 text-center">
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td className="p-2 text-center">#</td>
                    <td className="p-2"><input type="text" name="task" value={newTask.task} onChange={handleInputChange} className="border p-1 w-full"/></td>
                    <td className="p-2"><input type="text" name="detail" value={newTask.detail} onChange={handleInputChange} className="border p-1 w-full"/></td>
                    <td className="p-2"><input type="date" name="startDate" value={newTask.start_date} onChange={handleInputChange} className="border p-1 w-full"/></td>
                    <td className="p-2"><input type="date" name="dueDate" value={newTask.due_date} onChange={handleInputChange} className="border p-1 w-full"/></td>
                    <td></td>
                    <td></td>
                    <td className="p-2">{newTask.status}</td>
                </tr>
                <tr>
                    <td className="p-2 text-center">
                        <button onClick={addTask} className="bg-blue-500 text-white font-bold px-3 py-1 rounded hover:bg-blue-600">Confirm</button>
                    </td>
                    <td className="p-2 text-center">
                        <button onClick={clearTask} className="bg-red-500 text-white font-bold px-3 py-1 rounded hover:bg-red-600">Clear</button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
    </>
  )
}

export default App
