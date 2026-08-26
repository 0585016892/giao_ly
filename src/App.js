import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import VisitorTracker from "./components/VisitorTracker";
import ApiChecker from "./components/checkApiNF/ApiChecker";

function App() {
  return (
    <BrowserRouter>
      <ApiChecker>
        <VisitorTracker />
        <AppRoutes />
      </ApiChecker>
    </BrowserRouter>
  );
}

export default App;
