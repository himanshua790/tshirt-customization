import "./App.css";
import Canvas from "./canvas";
import Home from "./pages/Home";
import Customizer from "./pages/Customizer";

function App() {
  return (
    <div className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customizer />
    </div>
  );
}

export default App;
