function navigate(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    renderAll();
}

function selectVilla(villaName) {
    document.getElementById('unitType').value = villaName;
    navigate('booking');
}

async function submitBooking(e) {
    e.preventDefault();
    const guest = document.getElementById('guestName').value;
    const unit = document.getElementById('unitType').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest, unit, dates: `${checkIn} /${checkOut}` })
    });

    const data = await res.json();
    alert(data.message);
    document.getElementById('bookingForm').reset();
    navigate('guest-dashboard');
}

async function renderBookings() {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();

    const guestTable = document.getElementById('guestTable');
    const adminTable = document.getElementById('adminBookingTable');

    guestTable.innerHTML = '';
    adminTable.innerHTML = '';

    let pending = 0, approved = 0;

    bookings.forEach(b => {
        if (b.status === "Pending") pending++;
        if (b.status === "Approved") approved++;

        guestTable.innerHTML += `
            <tr>
                <td>#${b.id}</td>
                <td>${b.guest}</td>
                <td>${b.unit}</td>
                <td>${b.dates}</td>
                <td><span class="badge ${b.status.toLowerCase()}">${b.status}</span></td>
            </tr>
        `;

        adminTable.innerHTML += `
            <tr>
                <td>#${b.id}</td>
                <td>${b.guest}</td>
                <td>${b.unit}</td>
                <td>${b.dates}</td>
                <td><span class="badge ${b.status.toLowerCase()}">${b.status}</span></td>
                <td>
                    ${b.status === 'Pending' ? `
                        <button class="btn-sm btn-approve" onclick="updateBookingStatus(${b.id}, 'Approved')">Approve</button>
                        <button class="btn-sm btn-reject" onclick="updateBookingStatus(${b.id}, 'Rejected')">Reject</button>
                    ` : 'Processed'}
                </td>
            </tr>
        `;
    });

    document.getElementById('statTotal').innerText = bookings.length;
    document.getElementById('statPending').innerText = pending;
    document.getElementById('statApproved').innerText = approved;
}

async function updateBookingStatus(id, status) {
    await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    renderBookings();
}

async function renderAdminControls() {
    const resVillas = await fetch('/api/villas');
    const villas = await resVillas.json();
    document.getElementById('adminVillaList').innerHTML = villas.map(v => `
        <li>
            <span>${v.name}</span>
            <button class="btn-outline" onclick="toggleVillaStatus(${v.id})">${v.status}</button>
        </li>
    `).join('');

    const resEmp = await fetch('/api/employees');
    const employees = await resEmp.json();
    document.getElementById('adminEmpList').innerHTML = employees.map(e => `
        <li>
            <span><strong>${e.name}</strong> (${e.role})</span>
        </li>
    `).join('');
}

async function toggleVillaStatus(id) {
    await fetch(`/api/villas/${id}/toggle`, { method: 'PUT' });
    renderAdminControls();
}

async function addEmployee(e) {
    e.preventDefault();
    const name = document.getElementById('empName').value;
    const role = document.getElementById('empRole').value;

    await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
    });

    document.getElementById('empName').value = '';
    document.getElementById('empRole').value = '';
    renderAdminControls();
}

async function submitLeave(e) {
    e.preventDefault();
    const name = document.getElementById('leaveName').value;
    const reason = document.getElementById('leaveReason').value;
    const days = document.getElementById('leaveDays').value;

    await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, reason, days })
    });

    alert("Leave Request Submitted!");
    e.target.reset();
    renderLeaves();
}

async function renderLeaves() {
    const res = await fetch('/api/leaves');
    const leaves = await res.json();

    document.getElementById('leaveTable').innerHTML = leaves.map(l => `
        <tr>
            <td>${l.name}</td>
            <td>${l.reason}</td>
            <td>${l.days} Days</td>
            <td><span class="badge ${l.status.toLowerCase()}">${l.status}</span></td>
            <td>
                ${l.status === 'Pending' ? `
                    <button class="btn-sm btn-approve" onclick="approveLeave(${l.id})">Approve</button>
                ` : 'Approved'}
            </td>
        </tr>
    `).join('');
}

async function approveLeave(id) {
    await fetch(`/api/leaves/${id}/approve`, { method: 'PUT' });
    renderLeaves();
}

function renderAll() {
    renderBookings();
    renderAdminControls();
    renderLeaves();
}

window.onload = renderAll;
