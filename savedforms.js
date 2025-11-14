// ===== Utility Functions =====
function getSavedStudents() {
  try {
    const raw = localStorage.getItem("students");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("Parse error:", e);
    return [];
  }
}

function setSavedStudents(arr) {
  localStorage.setItem("students", JSON.stringify(arr || []));
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== Delete Form =====
function deleteForm(id) {
  if (!confirm("Delete this record?")) return;
  const all = getSavedStudents();
  const filtered = all.filter(s => String(s.id) !== String(id));
  setSavedStudents(filtered);
  alert("Deleted successfully");
  renderTable();
}

// ===== Load Form to Admission Page =====
function loadForm(id) {
  localStorage.setItem("loadStudent", String(id));
  window.location.href = "admissionform (1).html";
}

// ===== Print Form =====
function printForm(stu) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    alert("Popup blocked. Enable popups.");
    return;
  }

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Print Student</title>
<style>
  body{ font-family:Arial; margin:20px; }
  h2{text-align:center;}
  table{ width:100%; border-collapse:collapse; margin-top:12px; }
  td{ padding:8px; border:1px solid #000; }
  .label{ font-weight:700; background:#f0f0f0; width:30%; }
</style>
</head>
<body>
<h2>Student Admission Details</h2>
<table>
  <tr><td class="label">Name</td><td>${escapeHtml(stu.name)}</td></tr>
  <tr><td class="label">Gender</td><td>${escapeHtml(stu.gender)}</td></tr>
  <tr><td class="label">DOB</td><td>${escapeHtml(stu.dob)}</td></tr>
  <tr><td class="label">Mother Tongue</td><td>${escapeHtml(stu.mt)}</td></tr>
  <tr><td class="label">Aadhar</td><td>${escapeHtml(stu.saadhar)}</td></tr>
  <tr><td class="label">Father Name</td><td>${escapeHtml(stu.fname)}</td></tr>
  <tr><td class="label">Father Aadhar</td><td>${escapeHtml(stu.faadhar)}</td></tr>
  <tr><td class="label">Phone</td><td>${escapeHtml(stu.phone)}</td></tr>
  <tr><td class="label">Child ID</td><td>${escapeHtml(stu.child)}</td></tr>
</table>
<script>window.print();<\/script>
</body>
</html>`;
  
  w.document.write(html);
  w.document.close();
  w.focus();
}

// ===== Render Table =====
function renderTable() {
  const table = document.getElementById("savedTable");
  
  // clear old rows (keep header)
  while (table.rows.length > 1) table.deleteRow(1);

  const saved = getSavedStudents();
  if (saved.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.innerHTML = "<center class='small'>No saved forms found</center>";
    return;
  }

  saved.forEach(stu => {
    const row = table.insertRow();
    row.insertCell().innerText = stu.id;
    row.insertCell().innerText = stu.name || "(no name)";
    row.insertCell().innerText = stu.phone || "(no phone)";
    row.insertCell().innerText = stu.gender || "(no gender)";

    const actions = row.insertCell();

    const viewBtn = document.createElement("button");
    viewBtn.className = "view-btn";
    viewBtn.textContent = "View / Load";
    viewBtn.onclick = () => loadForm(stu.id);
    actions.appendChild(viewBtn);

    const printBtn = document.createElement("button");
    printBtn.className = "print-btn";
    printBtn.style.marginLeft = "6px";
    printBtn.textContent = "Print";
    printBtn.onclick = () => printForm(stu);
    actions.appendChild(printBtn);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.style.marginLeft = "6px";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteForm(stu.id);
    actions.appendChild(delBtn);
  });
}

// INITIAL LOAD
renderTable();
