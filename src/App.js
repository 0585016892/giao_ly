import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import VisitorTracker from "./components/VisitorTracker";

function App() {
  return (
    <BrowserRouter>
      <VisitorTracker />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
