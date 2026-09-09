import { useState } from "react";

import {
  Globe2,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Headphones,
  ChevronDown,
} from "lucide-react";

import "./index.css";

function App() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notification, setNotification] = useState("email");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Créneaux disponibles
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");

  // Données du formulaire
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    service: "",
    destination: "",
    appointmentDate: "",
    timeSlot: "",
    message: "",
  });

  // ============================================
  // GESTION DES CHAMPS
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ============================================
  // GESTION DE LA DATE ET DES CRENEAUX
  // ============================================

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;

    setFormData((previousData) => ({
      ...previousData,
      appointmentDate: selectedDate,
      timeSlot: "",
    }));

    setAvailableSlots([]);
    setSlotsMessage("");

    if (!selectedDate) return;

    setSlotsLoading(true);

    try {
      const response = await fetch(
        `https://djawed-tv-appointment-system.onrender.com/api/available-slots?date=${selectedDate}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de récupérer les disponibilités."
        );
      }

      setAvailableSlots(data.availableSlots || []);

      if (!data.availableSlots || data.availableSlots.length === 0) {
        setSlotsMessage(
          data.message ||
            "Aucun créneau disponible pour cette date."
        );
      }

    } catch (error) {
      console.error("Erreur disponibilités :", error);

      setSlotsMessage(
        "Impossible de charger les créneaux disponibles."
      );

    } finally {
      setSlotsLoading(false);
    }
  };

  // ============================================
  // ENVOI DU FORMULAIRE
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "https://djawed-tv-appointment-system.onrender.com/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            notificationMethod: notification,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Une erreur est survenue lors de l'envoi de votre demande."
        );

        return;
      }

      console.log("Rendez-vous créé :", data);

      setSubmitted(true);

    } catch (error) {
      console.error("Erreur :", error);

      alert(
        "Impossible de contacter le serveur. Vérifiez votre connexion."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // NOUVELLE DEMANDE
  // ============================================

  const handleNewRequest = () => {
    setSubmitted(false);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "",
      service: "",
      destination: "",
      appointmentDate: "",
      timeSlot: "",
      message: "",
    });

    setNotification("email");

    setAvailableSlots([]);
    setSlotsMessage("");
  };

  return (
    <div className="appointment-page">

      {/* ================= LEFT SIDE ================= */}

      <section className="visual-side">

        <div className="visual-overlay"></div>

        <div className="visual-content">

          {/* LOGO */}

          <div className="brand">

            <div className="brand-maple">
              ✦
            </div>

            <div className="brand-text">

              <div className="brand-name">
                DJAWED TV
              </div>

              <div className="brand-subtitle">
                IMMIGRATION
              </div>

              <div className="brand-slogan">
                Votre avenir, notre priorité
              </div>

            </div>

          </div>


          {/* HERO TEXT */}

          <div className="hero-text">

            <div className="small-title">
              VOTRE PROJET COMMENCE ICI
            </div>

            <h1>
              Réalisez votre projet
              <br />
              d’immigration au
              <span> Canada</span>
            </h1>

            <p>
              Un accompagnement sur mesure pour vous aider
              à concrétiser vos rêves. Études, travail,
              résidence permanente... Nous sommes à chaque
              étape de votre parcours.
            </p>

          </div>


          {/* FEATURES */}

          <div className="features">

            <div className="feature">

              <div className="feature-icon">
                <UserRound size={21} />
              </div>

              <div>
                <strong>Conseils personnalisés</strong>
                <span>Un suivi adapté à votre profil</span>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                <FileCheck2 size={21} />
              </div>

              <div>
                <strong>Dossiers sécurisés</strong>
                <span>Vos données sont protégées</span>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <strong>Accompagnement complet</strong>
                <span>De la préparation à l’arrivée</span>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                <Headphones size={21} />
              </div>

              <div>
                <strong>Une équipe expérimentée</strong>
                <span>À votre écoute, à chaque étape</span>
              </div>

            </div>

          </div>


          {/* BOTTOM MESSAGE */}

          <div className="bottom-message">

            <span>Le Canada vous attend</span>

            <span className="maple">
              ✦
            </span>

          </div>

        </div>

      </section>


      {/* ================= RIGHT SIDE ================= */}

      <section className="form-side">


        {/* LANGUAGE */}

        <div className="language-container">

          <button
            type="button"
            className="language-button"
            onClick={() => setLanguageOpen(!languageOpen)}
          >

            <Globe2 size={18} />

            <span>Français</span>

            <ChevronDown
              size={16}
              className={languageOpen ? "rotate" : ""}
            />

          </button>


          {languageOpen && (

            <div className="language-menu">

              <div>Français</div>

              <div>English</div>

            </div>

          )}

        </div>


        <div className="form-container">


          {/* MOBILE LOGO */}

          <div className="mobile-brand">

            <div className="mobile-logo-icon">
              ✦
            </div>

            <div>

              <strong>DJAWED TV</strong>

              <span>IMMIGRATION</span>

            </div>

          </div>


          {!submitted ? (

            <>


              {/* TITLE */}

              <div className="form-title">

                <h2>
                  Demandez votre
                  <br />
                  <span>rendez-vous</span>
                </h2>

                <p>
                  Choisissez une date et un créneau disponible
                  pour votre consultation.
                </p>

              </div>


              {/* FORM */}

              <form onSubmit={handleSubmit}>


                {/* NAME + EMAIL */}

                <div className="form-row">

                  <div className="input-group">

                    <label>Nom complet</label>

                    <div className="input-box">

                      <UserRound size={18} />

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Votre nom complet"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>


                  <div className="input-group">

                    <label>Email</label>

                    <div className="input-box">

                      <Mail size={18} />

                      <input
                        type="email"
                        name="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* PHONE + COUNTRY */}

                <div className="form-row">

                  <div className="input-group">

                    <label>Téléphone</label>

                    <div className="input-box">

                      <Phone size={18} />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="+213 XX XX XX XX"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>


                  <div className="input-group">

                    <label>Pays de résidence</label>

                    <div className="input-box">

                      <Globe2 size={18} />

                      <input
                        type="text"
                        name="country"
                        placeholder="Algérie"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* SERVICE + DESTINATION */}

                <div className="form-row">

                  <div className="input-group">

                    <label>Service souhaité</label>

                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Sélectionnez un service
                      </option>

                      <option value="Consultation immigration">
                        Consultation immigration
                      </option>

                      <option value="Études à l'étranger">
                        Études à l'étranger
                      </option>

                      <option value="Visa">
                        Visa
                      </option>

                      <option value="Évaluation de profil">
                        Évaluation de profil
                      </option>

                      <option value="Résidence permanente">
                        Résidence permanente
                      </option>

                      <option value="Autre">
                        Autre
                      </option>

                    </select>

                  </div>


                  <div className="input-group">

                    <label>Destination</label>

                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Pays de destination
                      </option>

                      <option value="Canada">
                        Canada
                      </option>

                      <option value="France">
                        France
                      </option>

                      <option value="Australie">
                        Australie
                      </option>

                      <option value="Royaume-Uni">
                        Royaume-Uni
                      </option>

                      <option value="États-Unis">
                        États-Unis
                      </option>

                      <option value="Autre">
                        Autre
                      </option>

                    </select>

                  </div>

                </div>


                {/* DATE + TIME */}

                <div className="form-row">


                  {/* DATE */}

                  <div className="input-group">

                    <label>Date souhaitée</label>

                    <div className="input-box">

                      <CalendarDays size={18} />

                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />

                    </div>

                  </div>


                  {/* TIME SLOT */}

                  <div className="input-group">

                    <label>Créneau disponible</label>

                    <div className="input-box">

                      <Clock3 size={18} />

                      <select
                        className="select-inside"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        required
                        disabled={
                          !formData.appointmentDate ||
                          slotsLoading ||
                          availableSlots.length === 0
                        }
                      >

                        <option value="">

                          {!formData.appointmentDate
                            ? "Choisissez d'abord une date"
                            : slotsLoading
                            ? "Chargement..."
                            : availableSlots.length === 0
                            ? "Aucun créneau disponible"
                            : "Choisir un créneau"}

                        </option>


                        {availableSlots.map((slot) => (

                          <option
                            key={slot}
                            value={slot}
                          >
                            {slot}
                          </option>

                        ))}

                      </select>

                    </div>


                    {slotsMessage && (

                      <small className="slots-message">
                        {slotsMessage}
                      </small>

                    )}

                  </div>

                </div>


                {/* NOTIFICATION */}

                <div className="input-group">

                  <label>
                    Comment souhaitez-vous recevoir la confirmation ?
                  </label>

                  <div className="notification-options">

                    <button
                      type="button"
                      className={
                        notification === "email"
                          ? "notification active"
                          : "notification"
                      }
                      onClick={() => setNotification("email")}
                    >

                      <Mail size={18} />

                      <span>Email</span>

                    </button>


                    <button
                      type="button"
                      className={
                        notification === "whatsapp"
                          ? "notification active"
                          : "notification"
                      }
                      onClick={() => setNotification("whatsapp")}
                    >

                      <MessageCircle size={18} />

                      <span>WhatsApp</span>

                    </button>

                  </div>

                </div>


                {/* MESSAGE */}

                <div className="input-group">

                  <label>
                    Message <small>(facultatif)</small>
                  </label>

                  <textarea
                    name="message"
                    placeholder="Décrivez brièvement votre demande..."
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                  />

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >

                  <span>

                    {loading
                      ? "Envoi en cours..."
                      : "Envoyer ma demande"}

                  </span>

                  {!loading && <ArrowRight size={20} />}

                </button>


                {/* SECURITY */}

                <div className="security">

                  <ShieldCheck size={17} />

                  <span>
                    Vos informations sont protégées et utilisées
                    uniquement pour traiter votre demande.
                  </span>

                </div>

              </form>

            </>

          ) : (

            /* ================= SUCCESS ================= */

            <div className="success-container">

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Demande envoyée !
              </h2>

              <p>
                Votre demande de rendez-vous a bien été enregistrée.
                Notre équipe vous contactera pour confirmer votre
                rendez-vous.
              </p>

              <div className="success-info">

                <CheckCircleIcon />

                <span>

                  Vous recevrez votre confirmation par{" "}

                  {notification === "email"
                    ? "email"
                    : "WhatsApp"}.

                </span>

              </div>


              <button
                type="button"
                className="new-request"
                onClick={handleNewRequest}
              >
                Nouvelle demande
              </button>

            </div>

          )}

        </div>


        {/* FOOTER */}

        <div className="right-footer">

          <div className="footer-items">

            <span>
              <ShieldCheck size={16} />
              Connexion sécurisée
            </span>

            <i></i>

            <span>
              <UserRound size={16} />
              Données protégées
            </span>

            <i></i>

            <span>
              <FileCheck2 size={16} />
              Service professionnel
            </span>

          </div>


          <p>
            © 2026 Djawed TV Immigration. Tous droits réservés.
          </p>

        </div>

      </section>

    </div>
  );
}


/* ============================================
   SUCCESS ICON
============================================ */

function CheckCircleIcon() {
  return (
    <div className="mini-check">
      ✓
    </div>
  );
}


export default App;