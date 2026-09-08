import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Trash2,
  User,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  RefreshCw,
  MessageCircle,
  LogOut,
} from "lucide-react";

import "./admin.css";

function AdminDashboard() {
  // ============================================
  // STATES
  // ============================================
const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");


  // ============================================
  // FETCH APPOINTMENTS
  // ============================================

  const fetchAppointments = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de récupérer les rendez-vous."
        );
      }

      setAppointments(data);

    } catch (error) {
      console.error("Erreur :", error);

      alert("Impossible de récupérer les rendez-vous.");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAppointments();
  }, []);

const handleLogout = () => {
  localStorage.removeItem("adminAuthenticated");

  navigate("/admin");
};
  // ============================================
  // NAVIGATION SIDEBAR
  // ============================================

  const showDashboard = () => {
    setActiveSection("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const showAppointments = () => {
    setActiveSection("appointments");

    document
      .getElementById("appointments-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };


  // ============================================
  // UPDATE STATUS
  // ============================================

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur de mise à jour."
        );
      }

      await fetchAppointments();

      setSelectedAppointment(null);

    } catch (error) {
      console.error(error);

      alert("Impossible de modifier le statut.");
    }
  };


  // ============================================
  // DELETE APPOINTMENT
  // ============================================

  const deleteAppointment = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette demande ?"
    );

    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur de suppression."
        );
      }

      await fetchAppointments();

      setSelectedAppointment(null);

    } catch (error) {
      console.error(error);

      alert("Impossible de supprimer la demande.");
    }
  };


  // ============================================
  // FILTER APPOINTMENTS
  // ============================================

  const filteredAppointments = appointments.filter(
    (appointment) => {

      const searchText = search.toLowerCase();


      const matchesSearch =
        appointment.fullName
          .toLowerCase()
          .includes(searchText) ||

        appointment.email
          .toLowerCase()
          .includes(searchText) ||

        appointment.service
          .toLowerCase()
          .includes(searchText);


      const matchesStatus =
        statusFilter === "all" ||
        appointment.status === statusFilter;


      const matchesDate =
        !dateFilter ||
        appointment.appointmentDate === dateFilter;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    }
  );


  // ============================================
  // CLEAR FILTERS
  // ============================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("");
  };


  // ============================================
  // STATISTICS
  // ============================================

  const total = appointments.length;


  const pending = appointments.filter(
    (appointment) =>
      appointment.status === "pending"
  ).length;


  const confirmed = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed"
  ).length;


  const cancelled = appointments.filter(
    (appointment) =>
      appointment.status === "cancelled"
  ).length;


  // ============================================
  // JSX
  // ============================================

  return (

    <div className="admin-page">


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="admin-sidebar">


        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-icon">
            ✦
          </div>


          <div>

            <strong>
              DJAWED TV
            </strong>

            <span>
              IMMIGRATION
            </span>

          </div>

        </div>


        {/* MENU */}

        <div className="admin-menu">


          <button
            type="button"
            className={
              activeSection === "dashboard"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={showDashboard}
          >

            <LayoutDashboard size={20} />

            <span>
              Dashboard
            </span>

          </button>


          <button
            type="button"
            className={
              activeSection === "appointments"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={showAppointments}
          >

            <CalendarDays size={20} />

            <span>
              Rendez-vous
            </span>

          </button>


        </div>


        {/* RETURN WEBSITE */}

       <div className="sidebar-bottom">

  <a href="/" className="back-to-site">
    <ArrowLeft size={18} />
    Retour au site
  </a>

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    <LogOut size={18} />
    Déconnexion
  </button>

</div>

      </aside>



      {/* ========================================
          MAIN
      ======================================== */}

      <main className="admin-main">


        {/* ========================================
            HEADER
        ======================================== */}

        <header className="admin-header">

          <div>

            <h1>
              Tableau de bord
            </h1>

            <p>
              Gérez les demandes de rendez-vous et vos clients.
            </p>

          </div>


          <button
            type="button"
            className="refresh-button"
            onClick={fetchAppointments}
          >

            <RefreshCw size={18} />

            Actualiser

          </button>


        </header>



        {/* ========================================
            STATISTICS
        ======================================== */}

        <section className="stats-grid">


          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon blue">

              <CalendarDays size={22} />

            </div>


            <div>

              <span>
                Total demandes
              </span>

              <strong>
                {total}
              </strong>

            </div>

          </div>



          {/* PENDING */}

          <div className="stat-card">

            <div className="stat-icon orange">

              <Clock size={22} />

            </div>


            <div>

              <span>
                En attente
              </span>

              <strong>
                {pending}
              </strong>

            </div>

          </div>



          {/* CONFIRMED */}

          <div className="stat-card">

            <div className="stat-icon green">

              <CheckCircle size={22} />

            </div>


            <div>

              <span>
                Confirmés
              </span>

              <strong>
                {confirmed}
              </strong>

            </div>

          </div>



          {/* CANCELLED */}

          <div className="stat-card">

            <div className="stat-icon red">

              <XCircle size={22} />

            </div>


            <div>

              <span>
                Annulés
              </span>

              <strong>
                {cancelled}
              </strong>

            </div>

          </div>


        </section>



        {/* ========================================
            APPOINTMENTS SECTION
        ======================================== */}

        <section
          className="appointments-section"
          id="appointments-section"
        >


          {/* SECTION HEADER */}

          <div className="section-header">


            <div>

              <h2>
                Demandes de rendez-vous
              </h2>

              <p>
                Gérez et suivez toutes les demandes reçues.
              </p>

            </div>


            <button
              type="button"
              className="refresh-button"
              onClick={fetchAppointments}
            >

              <RefreshCw size={18} />

              Actualiser

            </button>


          </div>



          {/* ========================================
              FILTERS
          ======================================== */}

          <div className="filters-container">


            {/* STATUS FILTERS */}

            <div className="status-filters">


              <button
                type="button"
                className={
                  statusFilter === "all"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setStatusFilter("all")
                }
              >

                Tous

                <span>
                  {total}
                </span>

              </button>



              <button
                type="button"
                className={
                  statusFilter === "pending"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setStatusFilter("pending")
                }
              >

                En attente

                <span>
                  {pending}
                </span>

              </button>



              <button
                type="button"
                className={
                  statusFilter === "confirmed"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setStatusFilter("confirmed")
                }
              >

                Confirmés

                <span>
                  {confirmed}
                </span>

              </button>



              <button
                type="button"
                className={
                  statusFilter === "cancelled"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setStatusFilter("cancelled")
                }
              >

                Annulés

                <span>
                  {cancelled}
                </span>

              </button>


            </div>



            {/* SEARCH AND DATE */}

            <div className="filters-actions">


              {/* SEARCH */}

              <div className="search-box">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>



              {/* DATE */}

              <div className="date-filter">

                <CalendarDays size={18} />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value)
                  }
                />

              </div>



              {/* CLEAR */}

              {(search ||
                dateFilter ||
                statusFilter !== "all") && (

                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >

                  Effacer

                </button>

              )}


            </div>


          </div>



          {/* RESULTS COUNT */}

          <div className="results-info">

            <span>

              {filteredAppointments.length} rendez-vous trouvé(s)

            </span>

          </div>



          {/* ========================================
              TABLE
          ======================================== */}

          <div className="table-container">


            {loading ? (

              <div className="loading">

                Chargement des rendez-vous...

              </div>


            ) : filteredAppointments.length === 0 ? (

              <div className="empty-state">

                <CalendarDays size={45} />

                <h3>
                  Aucune demande
                </h3>

                <p>
                  Les nouvelles demandes de rendez-vous
                  apparaîtront ici.
                </p>

              </div>


            ) : (

              <table>


                <thead>

                  <tr>

                    <th>
                      Client
                    </th>

                    <th>
                      Service
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Créneau
                    </th>

                    <th>
                      Statut
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>



                <tbody>


                  {filteredAppointments.map(
                    (appointment) => (

                      <tr key={appointment.id}>


                        {/* CLIENT */}

                        <td>

                          <div className="client-cell">


                            <div className="client-avatar">

                              {appointment.fullName
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div>

                              <strong>

                                {appointment.fullName}

                              </strong>


                              <span>

                                {appointment.email}

                              </span>

                            </div>


                          </div>

                        </td>



                        {/* SERVICE */}

                        <td>

                          {appointment.service}

                        </td>



                        {/* DATE */}

                        <td>

                          {appointment.appointmentDate}

                        </td>



                        {/* TIME */}

                        <td>

                          {appointment.timeSlot}

                        </td>



                        {/* STATUS */}

                        <td>

                          <StatusBadge
                            status={appointment.status}
                          />

                        </td>



                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">


                            <button
                              type="button"
                              className="details-button"
                              onClick={() =>
                                setSelectedAppointment(
                                  appointment
                                )
                              }
                            >

                              Voir

                            </button>



                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                deleteAppointment(
                                  appointment.id
                                )
                              }
                            >

                              <Trash2 size={17} />

                            </button>


                          </div>

                        </td>


                      </tr>

                    )
                  )}


                </tbody>


              </table>

            )}


          </div>


        </section>


      </main>



      {/* ========================================
          MODAL
      ======================================== */}

      {selectedAppointment && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedAppointment(null)
          }
        >


          <div
            className="appointment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="modal-header">


              <div>

                <h2>
                  Détails du rendez-vous
                </h2>

                <p>
                  Demande #{selectedAppointment.id}
                </p>

              </div>


              <button
                type="button"
                className="close-modal"
                onClick={() =>
                  setSelectedAppointment(null)
                }
              >

                ×

              </button>


            </div>



            {/* CLIENT */}

            <div className="modal-client">


              <div className="large-avatar">

                {selectedAppointment.fullName
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <h3>

                  {selectedAppointment.fullName}

                </h3>


                <StatusBadge
                  status={
                    selectedAppointment.status
                  }
                />

              </div>


            </div>



            {/* DETAILS */}

            <div className="details-grid">


              <Detail
                icon={<Mail size={18} />}
                label="Email"
                value={selectedAppointment.email}
              />


              <Detail
                icon={<Phone size={18} />}
                label="Téléphone"
                value={selectedAppointment.phone}
              />


              <Detail
                icon={<Globe size={18} />}
                label="Pays de résidence"
                value={selectedAppointment.country}
              />


              <Detail
                icon={<CalendarDays size={18} />}
                label="Date souhaitée"
                value={
                  selectedAppointment.appointmentDate
                }
              />


              <Detail
                icon={<Clock size={18} />}
                label="Créneau"
                value={selectedAppointment.timeSlot}
              />


              <Detail
                icon={<User size={18} />}
                label="Service"
                value={selectedAppointment.service}
              />


              <Detail
                icon={<Globe size={18} />}
                label="Destination"
                value={selectedAppointment.destination}
              />


              <Detail
                icon={<MessageCircle size={18} />}
                label="Notification"
                value={
                  selectedAppointment.notificationMethod
                }
              />


            </div>



            {/* MESSAGE */}

            {selectedAppointment.message && (

              <div className="client-message">

                <strong>
                  Message du client
                </strong>

                <p>

                  {selectedAppointment.message}

                </p>

              </div>

            )}



            {/* ACTIONS */}

            <div className="modal-actions">


              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  updateStatus(
                    selectedAppointment.id,
                    "cancelled"
                  )
                }
              >

                Annuler

              </button>



              <button
                type="button"
                className="confirm-button"
                onClick={() =>
                  updateStatus(
                    selectedAppointment.id,
                    "confirmed"
                  )
                }
              >

                <CheckCircle size={18} />

                Confirmer le rendez-vous

              </button>


            </div>


          </div>


        </div>

      )}


    </div>

  );
}



/* ============================================
   STATUS BADGE
============================================ */

function StatusBadge({ status }) {

  const labels = {

    pending: "En attente",

    confirmed: "Confirmé",

    cancelled: "Annulé",

  };


  return (

    <span className={`status ${status}`}>

      {labels[status] || status}

    </span>

  );

}



/* ============================================
   DETAIL COMPONENT
============================================ */

function Detail({ icon, label, value }) {

  return (

    <div className="detail-item">


      <div className="detail-icon">

        {icon}

      </div>


      <div>

        <span>

          {label}

        </span>


        <strong>

          {value || "-"}

        </strong>

      </div>


    </div>

  );

}


export default AdminDashboard;