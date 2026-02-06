import React, { useState } from 'react'

const App = () => {
  const [todo, setTodo] = useState('');
  const [todoList,setTodoList] = useState([]);  

  const addTodo = () => {
    if (todo.trim() === '') return;
      setTodoList([...todoList,{id: Date.now(), text: todo, completed: false}]);
      setTodo('');
    }

  return (
    <div>
      <h1>To-Do list</h1>
      <div className="input-container">
        <input type="text"
        placeholder='Add a new task...'
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
         />

         <button className='add-btn' onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todoList.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
