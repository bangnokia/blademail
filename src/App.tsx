import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <p>From Tauri with love</p>
        <p>
          <button className='border border-pink-500' type="button" onClick={() => setCount((count) => count + 1)}>
            counter lord is: {count}
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
