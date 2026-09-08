const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

// ============================================
// CONNEXION SQLITE
// ============================================

const db = new sqlite3.Database("./appointments.db", (err) => {
  if (err) {
    console.error(
      "Erreur de connexion à la base de données :",
      err.message
    );
  } else {
    console.log("Base de données SQLite connectée.");
  }
});

// ============================================
// CREATION TABLE RENDEZ-VOUS
// ============================================

db.run(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,

    service TEXT NOT NULL,
    destination TEXT NOT NULL,

    appointmentDate TEXT NOT NULL,
    timeSlot TEXT NOT NULL,

    notificationMethod TEXT NOT NULL,

    message TEXT,

    status TEXT DEFAULT 'pending',

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ============================================
// CONFIGURATION DES CRENEAUX
// ============================================

const availableTimeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",

  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00"
];

// ============================================
// FONCTION : VERIFIER JOUR OUVRABLE
// ============================================

function isWorkingDay(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  const day = date.getDay();

  // Vendredi = 5
  // Samedi = 6

  if (day === 5 || day === 6) {
    return false;
  }

  return true;
}

// ============================================
// ROUTE TEST
// ============================================

app.get("/", (req, res) => {
  res.json({
    message: "Appointment System API is running"
  });
});

// ============================================
// RECUPERER LES CRENEAUX DISPONIBLES
// ============================================

app.get("/api/available-slots", (req, res) => {

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: "La date est obligatoire."
    });
  }

  // Vérification du jour ouvrable

  if (!isWorkingDay(date)) {
    return res.json({
      date,
      availableSlots: [],
      message: "Aucun rendez-vous disponible pour cette journée."
    });
  }

  const sql = `
    SELECT timeSlot
    FROM appointments
    WHERE appointmentDate = ?
    AND status != 'cancelled'
  `;

  db.all(sql, [date], (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    // Créneaux déjà occupés

    const bookedSlots = rows.map(
      (appointment) => appointment.timeSlot
    );

    // Créneaux réellement disponibles

    const freeSlots = availableTimeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({
      date,
      availableSlots: freeSlots
    });

  });

});

// ============================================
// CREER UN RENDEZ-VOUS
// ============================================

app.post("/api/appointments", (req, res) => {

  const {
    fullName,
    email,
    phone,
    country,
    service,
    destination,
    appointmentDate,
    timeSlot,
    notificationMethod,
    message
  } = req.body;

  // ============================================
  // VALIDATION DES CHAMPS
  // ============================================

  if (
    !fullName ||
    !email ||
    !phone ||
    !country ||
    !service ||
    !destination ||
    !appointmentDate ||
    !timeSlot ||
    !notificationMethod
  ) {
    return res.status(400).json({
      error:
        "Tous les champs obligatoires doivent être remplis."
    });
  }

  // ============================================
  // VERIFIER LE JOUR
  // ============================================

  if (!isWorkingDay(appointmentDate)) {
    return res.status(400).json({
      error:
        "Les rendez-vous ne sont pas disponibles pour cette journée."
    });
  }

  // ============================================
  // VERIFIER QUE LE CRENEAU EXISTE
  // ============================================

  if (!availableTimeSlots.includes(timeSlot)) {
    return res.status(400).json({
      error: "Créneau horaire invalide."
    });
  }

  // ============================================
  // VERIFIER SI LE CRENEAU EST DEJA PRIS
  // ============================================

  const checkSql = `
    SELECT id
    FROM appointments
    WHERE appointmentDate = ?
    AND timeSlot = ?
    AND status != 'cancelled'
  `;

  db.get(
    checkSql,
    [appointmentDate, timeSlot],
    (err, existingAppointment) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      // Le créneau est déjà occupé

      if (existingAppointment) {
        return res.status(409).json({
          error:
            "Ce créneau vient d'être réservé. Veuillez choisir un autre horaire."
        });
      }

      // ============================================
      // ENREGISTRER LE RENDEZ-VOUS
      // ============================================

      const sql = `
        INSERT INTO appointments (
          fullName,
          email,
          phone,
          country,
          service,
          destination,
          appointmentDate,
          timeSlot,
          notificationMethod,
          message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        fullName,
        email,
        phone,
        country,
        service,
        destination,
        appointmentDate,
        timeSlot,
        notificationMethod,
        message || ""
      ];

      db.run(sql, values, function (err) {

        if (err) {
          console.error(err.message);

          return res.status(500).json({
            error:
              "Erreur lors de l'enregistrement du rendez-vous."
          });
        }

        res.status(201).json({

          message:
            "Demande de rendez-vous enregistrée avec succès.",

          appointmentId: this.lastID

        });

      });

    }
  );

});

// ============================================
// RECUPERER TOUS LES RENDEZ-VOUS
// ============================================

app.get("/api/appointments", (req, res) => {

  const sql = `
    SELECT *
    FROM appointments
    ORDER BY createdAt DESC
  `;

  db.all(sql, [], (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);

  });

});

// ============================================
// MODIFIER LE STATUT
// ============================================

app.put("/api/appointments/:id/status", (req, res) => {

  const { status } = req.body;
  const { id } = req.params;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "cancelled"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "Statut invalide."
    });
  }

  const sql = `
    UPDATE appointments
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, id], function (err) {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Rendez-vous introuvable."
      });
    }

    res.json({
      message: "Statut mis à jour avec succès."
    });

  });

});

// ============================================
// SUPPRIMER UN RENDEZ-VOUS
// ============================================

app.delete("/api/appointments/:id", (req, res) => {

  const { id } = req.params;

  db.run(
    "DELETE FROM appointments WHERE id = ?",
    [id],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Rendez-vous introuvable."
        });
      }

      res.json({
        message: "Rendez-vous supprimé avec succès."
      });

    }
  );

});

// ============================================
// LANCEMENT DU SERVEUR
// ============================================

app.listen(PORT, () => {

  console.log("-----------------------------------");
  console.log(
    `Server running on http://localhost:${PORT}`
  );
  console.log("-----------------------------------");

});