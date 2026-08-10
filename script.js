function navigate(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    renderAll();
}

function selectRoom(roomName) {
    document.getElementById('roomType').value = roomName;
    navigate('booking');
}

async function submitBooking(e) {
    e.preventDefault();
    const guest = document.getElementById('guestName').value;
    const room = document.getElementById('roomType').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest, room, dates: `${checkIn} / ${checkOut}` })
    });

    const data = await res.json();
    alert(data.message);
    document.getElementById('bookingForm').reset();
    navigate('customer-dashboard');
}

async function renderBookings() {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();

    const custTable = document.getElementById('customerTable');
    const adminTable = document.getElementById('adminBookingTable');

    custTable.innerHTML = '';
    adminTable.innerHTML = '';

    let pending = 0, approved = 0;

    bookings.forEach(b => {
        if (b.status === "Pending") pending++;
        if (b.status === "Approved") approved++;

        custTable.innerHTML += `
            <tr>
                <td>#${b.id}</td>
                <td>${b.guest}</td>
                <td>${b.room}</td>
                <td>${b.dates}</td>
                <td><span class="badge ${b.status.toLowerCase()}">${b.status}</span></td>
            </tr>
        `;

        adminTable.innerHTML += `
            <tr>
                <td>#${b.id}</td>
                <td>${b.guest}</td>
                <td>${b.room}</td>
                <td>${b.dates}</td>
                <td><span class="badge ${b.status.toLowerCase()}">${b.status}</span></td>
                <td>
                    ${b.status === 'Pending' ? `
                        <button class="btn-sm btn-approve" onclick="updateBookingStatus(${b.id}, 'Approved')">Approve</button>
                        <button class="btn-sm btn-reject" onclick="updateBookingStatus(${b.id}, 'Rejected')">Reject</button>
                    ` : 'Completed'}
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
    const resRooms = await fetch('/api/rooms');
    const rooms = await resRooms.json();
    document.getElementById('adminRoomList').innerHTML = rooms.map(r => `
        <li>
            <span>${r.name}</span>
            <button class="btn-outline" onclick="toggleRoomStatus(${r.id})">${r.status}</button>
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

async function toggleRoomStatus(id) {
    await fetch(`/api/rooms/${id}/toggle`, { method: 'PUT' });
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

    alert("Leave Application Submitted!");
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
