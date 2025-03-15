import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="absolute w-screen top-0 left-0 h-screen bg-red-200 p4">
            <h1 className="text-black mx-7 my-3"><span className="m-0 p-0 text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-600">To-Do List</span></h1>
            <table className="w-39/40 mx-auto border-separate border-spacing-0">
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
                <tr className="input-column">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr className="input-column">
                    <td>C</td>
                    <td>X</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>

            <button className="bg-gradient-to-r from-blue-400 to-red-600 font-bold text-white text-xl px-4 py-2 rounded-full my-4 mx-5 shadow-md
            active:scale-90 transition duration-200 ">
                Add New Task
            </button>

        </div>
    </>
  )
}

export default App
