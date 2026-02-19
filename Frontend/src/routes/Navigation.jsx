import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// pages
import Login from "../pages/auth/Login";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";


// Agent
import AgentDashboard from "../pages/agent/Dashboard";
import AgentUnassignedTickets from "../pages/agent/UnassignedTickets";
import AgentMyTickets from "../pages/agent/MyTickets";
import AgentCompletedTickets from "../pages/agent/CompletedTickets";
import AgentTicketDetails from "../pages/agent/TicketDetails";

// Customer
import CustomerDashboard from "../pages/customer/Dashboard";
import Unauthorized from "../pages/Unauthorized";
import Register from "../pages/auth/Register";
import CreateTicket from "../pages/customer/CreateTicket";
import TicketDetails from "../pages/customer/TicketDetails";
import TicketChat from "../pages/customer/TicketChat";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminTickets from "../pages/admin/AdminTickets";
import AdminAuditLogs from "../pages/admin/AdminAuditLogs";
import AgentTicketChat from "../pages/agent/TicketChat";
import AdminTicketDetails from "../pages/admin/AdminTicketDetails";
import AdminTicketChat from "../pages/admin/AdminTicketChat";
import AdminAssignSecondaryAgent from "../pages/admin/AdminAssignSecondaryAgent";

function Navigation() {
  return (
    <Routes>

      {/* ===== COMMON ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ===== ADMIN ===== */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tickets"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminAuditLogs />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/tickets/:ticketId" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminTicketDetails /></ProtectedRoute>} />
<Route path="/admin/tickets/:ticketId/chat"  element={<ProtectedRoute allowedRoles={["Admin"]}><AdminTicketChat /></ProtectedRoute>} />    
<Route path="/admin/tickets/:ticketId/assign-secondary"  element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAssignSecondaryAgent /></ProtectedRoute>} />    


      {/* ===== AGENT ===== */}
      <Route
        path="/agent/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Agent"]}>
            <AgentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/agent/tickets/unassigned"
  element={
    <ProtectedRoute allowedRoles={["Agent"]}>
      <AgentUnassignedTickets />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/tickets/my"
  element={
    <ProtectedRoute allowedRoles={["Agent"]}>
      <AgentMyTickets />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/tickets/completed"
  element={
    <ProtectedRoute allowedRoles={["Agent"]}>
      <AgentCompletedTickets />
    </ProtectedRoute>
  }
      />
      
      <Route
  path="/agent/ticketdetails/:ticketId"
  element={
    <ProtectedRoute allowedRoles={["Agent"]}>
      <AgentTicketDetails />
    </ProtectedRoute>
  }
      />
      
      <Route path="/agent/ticketchat/:ticketId" 
      element={
    <ProtectedRoute allowedRoles={["Agent"]}>
      <AgentTicketChat />
    </ProtectedRoute>
  }
      />



      {/* ===== CUSTOMER ===== */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/tickets/create"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CreateTicket />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/ticketchat/:ticketId"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <TicketChat />
          </ProtectedRoute>
        }
          />
          
        <Route
        path="/customer/ticketdetails/:ticketId"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <TicketDetails />
          </ProtectedRoute>
        }
      />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/unauthorized" />} />

    </Routes>
  );
}

export default Navigation;
