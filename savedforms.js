// savedforms.js
// Requires firebase-config.js loaded earlier
function esc(s){ if (!s && s !== 0) return ''; return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

auth.onAuthStateChanged(async user => {
  if (!user) return location.href = 'loginform.html';
  // load rows
  const tbody = document.querySelector('#savedTable tbody');
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  const snap = await db.collection('admissions').orderBy('createdAt','desc').get();
  tbody.innerHTML = '';
  let i = 0;
  snap.forEach(doc => {
    i++;
    const d = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i}</td>
      <td>${esc(d.name)}</td>
      <td>${esc(d.phone)}</td>
      <td>${esc(d.sclass)}</td>
      <td>
        <button onclick="printForm('${doc.id}')">Print</button>
        <button onclick="loadEdit('${doc.id}')">Edit</button>
        <button onclick="deleteForm('${doc.id}')">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
});

async function printForm(id) {
  const doc = await db.collection('admissions').doc(id).get();
  if (!doc.exists) return alert('Not found');
  const d = doc.data();
  const html = `<html><head><meta charset="utf-8"><title>Admission</title></head><body>
    <h2>Admission</h2>
    <p><b>Name:</b> ${esc(d.name)}</p>
    <p><b>DOB:</b> ${esc(d.dob)}</p>
    <p><b>Phone:</b> ${esc(d.phone)}</p>
    <p><b>Class:</b> ${esc(d.sclass)}</p>
    <script>window.print()</script>
    </body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html); w.document.close();
}

async function loadEdit(id) {
  const doc = await db.collection('admissions').doc(id).get();
  if (!doc.exists) return alert('Not found');
  localStorage.setItem('loadStudentFirestore', JSON.stringify({ id, data: doc.data() }));
  location.href = 'admissionform (1).html';
}

async function deleteForm(id) {
  const user = auth.currentUser;
  if (!user) return location.href = 'loginform.html';
  // check admin role by reading users collection
  const uDoc = await db.collection('users').doc(user.uid).get();
  if (!uDoc.exists || uDoc.data().role !== 'admin') return alert('Only admin can delete');
  if (!confirm('Delete this record?')) return;
  await db.collection('admissions').doc(id).delete();
  alert('Deleted'); location.reload();
}
