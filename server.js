const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let villas = [
    { id: 1, name: "Overwater Bungalow 01", price: 650, status: "Available" },
    { id: 2, name: "Oceanfront Pool Villa 02", price: 500, status: "Booked" },
    { id: 3, name: "Tropical Forest Chalet 03", price: 380, status: "Available" }
];

let bookings = [
    { id: 201, guest: "Michael Scott", unit: "Overwater Bungalow 01", dates: "2026-09-01 / 2026-09-05", status: "Approved" },
    { id: 202, guest: "Emma Watson", unit: "Oceanfront Pool Villa 02", dates: "2026-09-10 / 2026-09-12", status: "Pending" }
];

let employees = [
    { id: 1, name: "Tanvir Hossain", role: "Resort Manager" },
    { id: 2, name: "Nusrat Jahan", role: "Activity Coordinator" }
];

let leaves = [
    { id: 1, name: "Nusrat Jahan", reason: "Personal Leave", days: 3, status: "Pending" }
];

app.get('/api/villas', (req, res) => res.json(villas));

app.put('/api/villas/:id/toggle', (req, res) => {
    const item = villas.find(v => v.id === parseInt(req.params.id));
    if (item) {
        item.status = item.status === "Available" ? "Booked" : "Available";
        res.json({ message: "Villa status updated!", item });
    } else {
        res.status(404).json({ message: "Villa not found" });
    }
});

app.get('/api/bookings', (req, res) => res.json(bookings));

app.post('/api/bookings', (req, res) => {
    const newBooking = {
        id: Math.floor(200 + Math.random() * 800),
        ...req.body,
        status: "Pending"
    };
    bookings.push(newBooking);
    res.json({ message: "Resort reservation request submitted!", booking: newBooking });
});

app.put('/api/bookings/:id/status', (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (booking) {
        booking.status = req.body.status;
        res.json({ message: `Reservation ${req.body.status}!`, booking });
    } else {
        res.status(404).json({ message: "Reservation not found" });
    }
});

app.get('/api/employees', (req, res) => res.json(employees));

app.post('/api/employees', (req, res) => {
    const newEmp = { id: Date.now(), ...req.body };
    employees.push(newEmp);
    res.json({ message: "Staff member registered!", employee: newEmp });
});

app.get('/api/leaves', (req, res) => res.json(leaves));

app.post('/api/leaves', (req, res) => {
    const newLeave = { id: Date.now(), ...req.body, status: "Pending" };
    leaves.push(newLeave);
    res.json({ message: "Leave request logged!", leave: newLeave });
});

app.put('/api/leaves/:id/approve', (req, res) => {
    const leave = leaves.find(l => l.id === parseInt(req.params.id));
    if (leave) {
        leave.status = "Approved";
        res.json({ message: "Staff leave approved!", leave });
    } else {
        res.status(404).json({ message: "Leave record not found" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Resort Server live at http://localhost:${PORT}`));
}

module.exports = app;
