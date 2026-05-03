import {Navigate, Route, Routes, useParams} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddRun from './pages/AddRun'
import Archive from './pages/Archive'
import Stats from './pages/Stats'
import EditRun from "./pages/EditRun.jsx";

function ProtectedRoute({children}) {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to="/login"/>
}

export default function App() {
    const {id} = useParams()

    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="/login"/>}/>
                <Route path="/add-run" element={
                    <ProtectedRoute>
                        <AddRun/>
                    </ProtectedRoute>
                }/>
                <Route path="/archive" element={
                    <ProtectedRoute>
                        <Archive/>
                    </ProtectedRoute>
                }/>
                <Route path="/stats" element={
                    <ProtectedRoute>
                        <Stats/>
                    </ProtectedRoute>
                }/>
                <Route path="/runs/:id" element={
                    <ProtectedRoute>
                        <EditRun/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </AuthProvider>
    )
}
