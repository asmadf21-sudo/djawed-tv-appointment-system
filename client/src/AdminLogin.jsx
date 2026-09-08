import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck, ArrowRight } from "lucide-react";

import "./adminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Identifiants temporaires pour la démonstration
    const adminEmail = "admin@djawedtv.com";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("adminAuthenticated", "true");

      navigate("/admin/dashboard");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-brand">
          <div className="login-logo-icon">✦</div>

          <div>
            <strong>DJAWED TV</strong>
            <span>IMMIGRATION</span>
          </div>
        </div>

        <div className="login-card">

          <div className="login-icon">
            <ShieldCheck size={30} />
          </div>

          <h1>Espace administrateur</h1>

          <p>
            Connectez-vous pour accéder à la gestion des
            demandes de rendez-vous.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="login-input-group">
              <label>Adresse email</label>

              <div className="login-input">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="admin@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>Mot de passe</label>

              <div className="login-input">
                <LockKeyhole size={18} />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button type="submit" className="login-button">
              <span>Se connecter</span>
              <ArrowRight size={19} />
            </button>

          </form>

          <div className="login-security">
            <ShieldCheck size={16} />

            <span>
              Accès réservé aux administrateurs autorisés.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminLogin;