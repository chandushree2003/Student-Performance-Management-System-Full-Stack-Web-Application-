const express = require("express");
const router = express.Router();
const db = require("../db");

function calculateGrade(marks) {
  if (marks >= 90) return "A";
  if (marks >= 75) return "B";
  if (marks >= 50) return "C";
  return "F";
}

// ================= GET TOP STUDENTS =================
router.get("/top", (req, res) => {
  db.query(
    "SELECT * FROM students WHERE percentage >= 90",
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    }
  );
});

// ================= ADD STUDENT =================
router.post("/", (req, res) => {
  let { usn, name, marks } = req.body;

  // FIX: strict validation
  if (!usn || !name || isNaN(marks)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  marks = Number(marks);
  const percentage = marks;
  const grade = calculateGrade(marks);

  const sql =
    "INSERT INTO students (usn, name, marks, percentage, grade) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [usn, name, marks, percentage, grade], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "USN already exists" });
      }
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Student added successfully" });
  });
});

// ================= GET ALL =================
router.get("/", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// ================= UPDATE =================
router.put("/:id", (req, res) => {
  const id = req.params.id;
  let { usn, name, marks } = req.body;

  if (!usn || !name || isNaN(marks)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  marks = Number(marks);
  const percentage = marks;
  const grade = calculateGrade(marks);

  const sql = `
    UPDATE students
    SET usn=?, name=?, marks=?, percentage=?, grade=?
    WHERE id=?
  `;

  db.query(sql, [usn, name, marks, percentage, grade, id], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "USN already exists" });
      }
      return res.status(500).json({ message: "Update failed" });
    }
    res.json({ message: "Student updated successfully" });
  });
});

// ================= DELETE =================
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM students WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "Student deleted successfully" });
    }
  );
});

module.exports = router;
