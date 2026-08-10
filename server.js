const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let rooms = [
    { id: 1, name: "Presidential Suite 101", price: 450, status: "Available" },
    { id: 2, name: "Executive Deluxe 201", price: 280, status: "Booked" },
    { id: 3, name: "Royal Family Suite 301", price: 350, status: "Available" }
];

let bookings = [
    { id: 101, guest: "Alexander Wright", room: "Presidential Suite 101", dates: "2026-08-15 / 2026-08-18", status: "Approved" },
    { id: 102, guest: "Sophia Chen", room: "Executive Deluxe 201", dates: "2026-08-20 / 2026-08-22", status: "Pending" }
];

let employees = [
    { id: 1, name: "Marcus Aurelius", role: "General Manager" },
    { id: 2, name: "Elena Rostova", role: "Head Receptionist" }
];

let leaves = [
    { id: 1, name: "Elena Rostova", reason: "Medical Leave", days: 2, status: "Pending" }
];

app.get('/api/rooms', (req, res) => res.json(rooms));

app.put('/api/rooms/:id/toggle', (req, res) => {
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    if (room) {
        room.status = room.status === "Available" ? "Booked" : "Available";
        res.json({ message: "Room status updated!", room });
    } else {
        res.status(404).json({ message: "Room not found" });
    }
});

app.get('/api/bookings', (req, res) => res.json(bookings));

app.post('/api/bookings', (req, res) => {
    const newBooking = {
        id: Math.floor(100 + Math.random() * 900),
        ...req.body,
        status: "Pending"
    };
    bookings.push(newBooking);
    res.json({ message: "Booking submitted successfully!", booking: newBooking });
});

app.put('/api/bookings/:id/status', (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (booking) {
        booking.status = req.body.status;
        res.json({ message: `Booking ${req.body.status}!`, booking });
    } else {
        res.status(404).json({ message: "Booking not found" });
    }
});

app.get('/api/employees', (req, res) => res.json(employees));

app.post('/api/employees', (req, res) => {
    const newEmp = { id: Date.now(), ...req.body };
    employees.push(newEmp);
    res.json({ message: "Employee added successfully!", employee: newEmp });
});

app.get('/api/leaves', (req, res) => res.json(leaves));

app.post('/api/leaves', (req, res) => {
    const newLeave = { id: Date.now(), ...req.body, status: "Pending" };
    leaves.push(newLeave);
    res.json({ message: "Leave request submitted!", leave: newLeave });
});

app.put('/api/leaves/:id/approve', (req, res) => {
    const leave = leaves.find(l => l.id === parseInt(req.params.id));
    if (leave) {
        leave.status = "Approved";
        res.json({ message: "Leave request approved!", leave });
    } else {
        res.status(404).json({ message: "Leave request not found" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
