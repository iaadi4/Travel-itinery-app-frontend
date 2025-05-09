import { Toaster } from "sonner";
import OnboardingForm from "./components/OnboardingForm";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardingForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
