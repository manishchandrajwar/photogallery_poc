import "./App.css";
import Gallery from "./Components/Gallery";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="main-grid">
        <Gallery />
      </div>
    </>
  );
}

export default App;
