
import './App.css'
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import IndexPage from "./UI/Pages/IndexPage.jsx";


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path={"/a"} element={<IndexPage/>} />
                  </Routes>
      </BrowserRouter>
  )
}

export default App
