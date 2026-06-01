import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import DSAQuestions from "../pages/DSAQuestions";
import QuestionDetails from "../pages/QuestionDetails";
import MockInterview from "../pages/MockInterview";
import CodeEditor from "../pages/CodeEditor";
import ResumeAnalyzer from "../pages/ResumeAnalyzer";
import Analytics from "../pages/Analytics";
import AICodeReview from "../pages/AICodeReview";
import Progress from "../pages/Progress";
import VoiceInterview from "../pages/VoiceInterview";

import ProtectedRoute from "../components/ProtectedRoute";

import { Toaster } from "react-hot-toast";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#f4f4f5",
            border: "1px solid #27272a",
          }
        }}
      />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
             path="/dsa"
            element={
        <ProtectedRoute>
        <DSAQuestions />
        </ProtectedRoute>
        }
        />

        <Route
  path="/mock-interview"
  element={
    <ProtectedRoute>
      <MockInterview />
    </ProtectedRoute>
  }
/>
<Route
  path="/progress"
  element={
    <ProtectedRoute>
      <Progress />
    </ProtectedRoute>
  }
/>

<Route
  path="/voice-interview"
  element={
    <ProtectedRoute>
      <VoiceInterview />
    </ProtectedRoute>
  }
/>
        <Route
  path="/questions"
  element={
    <ProtectedRoute>
      <QuestionDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/resume-analyzer"
  element={
    <ProtectedRoute>
      <ResumeAnalyzer />
    </ProtectedRoute>
  }
/>
<Route
  path="/editor"
  element={
    <ProtectedRoute>
      <CodeEditor />
    </ProtectedRoute>
  }
/>

<Route
  path="/ai-review"
  element={
    <ProtectedRoute>
      <AICodeReview />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;