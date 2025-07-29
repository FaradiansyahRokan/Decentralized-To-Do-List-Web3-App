import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoList from './artifacts/TodoList.json';



const CONTRACT_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const todoContract = new ethers.Contract(CONTRACT_ADDRESS, TodoList.abi, signer);
        setContract(todoContract);

        const count = await todoContract.taskCount();
        const loadedTasks = [];
        for (let i = 1; i <= count; i++) {
          const task = await todoContract.tasks(i);
          loadedTasks.push(task);
        }
        setTasks(loadedTasks);
      } else {
        alert('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const addTask = async () => {
    if (input.trim() === '') return;
    const tx = await contract.createTask(input);
    await tx.wait();
    const count = await contract.taskCount();
    const task = await contract.tasks(count);
    setTasks([...tasks, task]);
    setInput('');
  };

  const toggleCompleted = async (id) => {
    const tx = await contract.toggleCompleted(id);
    await tx.wait();
    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        if (task.id.toString() === id.toString()) {
          return await contract.tasks(id);
        }
        return task;
      })
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">Decentralized To-Do List</h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you need to do?"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                task.completed ? 'bg-green-700' : 'bg-gray-700'
              }`}
            >
              <span className={task.completed ? 'line-through opacity-70' : ''}>{task.content}</span>
              <button
                onClick={() => toggleCompleted(task.id)}
                className={`text-sm font-medium ${
                  task.completed ? 'text-yellow-300' : 'text-green-400'
                } hover:underline`}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Connected Account: {account || 'Not connected'}
        </p>
      </div>
    </div>
  );
}

export default App;
