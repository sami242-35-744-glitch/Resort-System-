// --- Initial Data Setup ---
let villas = JSON.parse(localStorage.getItem('villas')) || [
    { id: 1, name: "Overwater Bungalow 01", price: 650, status: "Available" },
    { id: 2, name: "Oceanfront Pool Villa 02", price: 500, status: "Booked" },
    { id: 3, name: "Tropical Forest Chalet 03", price: 380, status: "Available" }
];

let bookings = JSON.parse(localStorage.getItem('bookings')) || [
    { id: 201, guest: "Michael Scott", unit: "Overwater Bungalow 01", dates: "2026-09-01 / 2026-09-05", status: "Approved" },
    { id: 202, guest: "Emma Watson", unit: "Oceanfront Pool Villa 02", dates: "2026-09-10 / 2026-09-12", status: "Pending" }
];

let employees = JSON.parse(localStorage.getItem('employees')) || [
    { id: 1, name: "Tanvir Hossain", role: "Resort Manager" },
    { id: 2, name: "Nusrat Jahan", role: "Activity Coordinator" }
];

let leaves = JSON.parse(localStorage.getItem('leaves')) || [
    { id: 1, name: "Nusrat Jahan", reason: "Personal Leave", days: 3, status: "Pending" }
];
    
let isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';


function saveData() {
    localStorage.setItem('villas', JSON.stringify(villas));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('leaves', JSON.stringify(leaves));
}

function navigate(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    renderAll();
}


function selectVilla(villaName) {
    document.getElementById('unitType').value = villaName;
    navigate('booking');
}


function checkAdminAuth() {
    const loginForm = document.getElementById('adminLoginForm');
    const adminContent = document.getElementById('adminContent');

    if (!loginForm || !adminContent) return;

    if (isAdminLoggedIn) {
        loginForm.style.display = 'none';
        adminContent.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        adminContent.style.display = 'none';
    }
}

function adminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    // Credentials set here (Username: admin | Password: 123456)
    if (user === 'admin' && pass === '123456') {
        isAdminLoggedIn = true;
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        checkAdminAuth();
        document.getElementById('adminUser').value = '';
        document.getElementById('adminPass').value = '';
    } else {
        alert('Invalid Username or Password!');
    }
}

function adminLogout() {
    isAdminLoggedIn = false;
    sessionStorage.removeItem('isAdminLoggedIn');
    checkAdminAuth();
}


function submitBooking(e) {
    e.preventDefault();
    const guest = document.getElementById('guestName').value;
    const unit = document.getElementById('unitType').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    const newBooking = {
        id: Math.floor(200 + Math.random() * 800),
        guest,
        unit,
        dates: `${checkIn} / ${checkOut}`,
        status: "Pending"
    };

    bookings.push(newBooking);
    saveData();
    alert("Resort reservation request submitted successfully!");
    document.getElementById('bookingForm').reset();
    navigate('guest-dashboard');
}

function renderBookings() {
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

function updateBookingStatus(id, status) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = status;
        saveData();
        renderBookings();
    }
}

function renderAdminControls() {
    document.getElementById('adminVillaList').innerHTML = villas.map(v => `
        <li>
            <span>${v.name}</span>
            <button class="btn-outline" onclick="toggleVillaStatus(${v.id})">${v.status}</button>
        </li>
    `).join('');

    document.getElementById('adminEmpList').innerHTML = employees.map(e => `
        <li>
            <span><strong>${e.name}</strong> (${e.role})</span>
        </li>
    `).join('');
}

function toggleVillaStatus(id) {
    const villa = villas.find(v => v.id === id);
    if (villa) {
        villa.status = villa.status === "Available" ? "Booked" : "Available";
        saveData();
        renderAdminControls();
    }
}

function addEmployee(e) {
    e.preventDefault();
    const name = document.getElementById('empName').value;
    const role = document.getElementById('empRole').value;

    employees.push({ id: Date.now(), name, role });
    saveData();

    document.getElementById('empName').value = '';
    document.getElementById('empRole').value = '';
    renderAdminControls();
}

function submitLeave(e) {
    e.preventDefault();
    const name = document.getElementById('leaveName').value;
    const reason = document.getElementById('leaveReason').value;
    const days = document.getElementById('leaveDays').value;

    leaves.push({ id: Date.now(), name, reason, days, status: "Pending" });
    saveData();

    alert("Leave Request Submitted!");
    e.target.reset();
    renderLeaves();
}

function renderLeaves() {
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

function approveLeave(id) {
    const leave = leaves.find(l => l.id === id);
    if (leave) {
        leave.status = "Approved";
        saveData();
        renderLeaves();
    }
}

// Render All Components On Page Load
function renderAll() {
    checkAdminAuth();
    renderBookings();
    renderAdminControls();
    renderLeaves();
}

window.onload = renderAll;
