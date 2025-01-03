let availableRooms = {
    1: true,  // Room 1 is available
    2: true,  // Room 2 is available
    3: true,  // Conference Room is available
    4: true,  // VIP Room is available
    5: true   // Seminar Hall is available
};

let availableResources = {
    projector: true,   // Projector is available
    whiteboard: true,  // Whiteboard is available
    laptop: true       // Laptop is available
};

let bookings = [];  // Array to store bookings

// Open the booking form and pre-select the room
function openBookingForm(roomId) {
    const roomSelect = document.getElementById("room-select");
    roomSelect.value = roomId;  // Pre-select the room in the booking form
    document.getElementById("booking-form").style.display = "block";
}

// Close the booking form
function closeBookingForm() {
    document.getElementById("booking-form").style.display = "none";
    document.getElementById("status").classList.remove("success", "error");
    document.getElementById("status").textContent = "";
    document.getElementById("error-message").textContent = "";  // Clear any error message
}

// Confirm the booking
function confirmBooking() {
    const roomId = document.getElementById("room-select").value;
    const name = document.getElementById("name").value.trim();
    const officeId = document.getElementById("office-id").value.trim();
    const fromTime = document.getElementById("from-time").value;
    const timeRange = document.getElementById("time-range").value;

    const projector = document.getElementById("projector").checked;
    const whiteboard = document.getElementById("whiteboard").checked;
    const laptop = document.getElementById("laptop").checked;

    // Validate input
    if (!name || !officeId || !fromTime || !timeRange) {
        displayError("Please fill in all fields.");
        return;
    }

    // Convert to Date objects for comparison
    const fromDate = new Date(fromTime);
    const currentDate = new Date();

    // Ensure the booking is for the present or future and at least 1 hour duration
    if (fromDate < currentDate) {
        displayError("You cannot book for a past time.");
        return;
    }

    if (timeRange < 1) {
        displayError("The booking duration must be at least 1 hour.");
        return;
    }

    // Ensure room availability
    if (!availableRooms[roomId]) {
        displayError("Sorry, this room is not available.");
        return;
    }

    // Ensure at least one resource is selected
    if (!projector && !whiteboard && !laptop) {
        displayError("Please select at least one additional resource.");
        return;
    }

    // Check resource availability
    if (projector && !availableResources.projector) {
        displayError("The projector is unavailable at the selected time.");
        return;
    }
    if (whiteboard && !availableResources.whiteboard) {
        displayError("The whiteboard is unavailable at the selected time.");
        return;
    }
    if (laptop && !availableResources.laptop) {
        displayError("The laptop is unavailable at the selected time.");
        return;
    }

    // Mark room and resources as booked
    availableRooms[roomId] = false;
    if (projector) availableResources.projector = false;
    if (whiteboard) availableResources.whiteboard = false;
    if (laptop) availableResources.laptop = false;

    // Store the booking information
    const booking = {
        room: `Room ${roomId}`,
        name: name,
        officeId: officeId,
        fromTime: fromDate.toLocaleString(),
        toTime: new Date(fromDate.getTime() + timeRange * 60 * 60 * 1000).toLocaleString(),
        resources: {
            projector: projector,
            whiteboard: whiteboard,
            laptop: laptop
        }
    };

    bookings.push(booking);

    // Display the current bookings
    displayBookings();

    // Display success message
    displayStatus(`Booking confirmed for ${name} (Office ID: ${officeId}) in Room ${roomId}.`, "success");

    // Close the booking form after confirming
    setTimeout(() => closeBookingForm(), 2000);
}

// Display error message
function displayError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
}

// Display status message
function displayStatus(message, statusType) {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = message;
    statusDiv.classList.add(statusType);
}

// Display all the bookings
function displayBookings() {
    const bookingsList = document.getElementById("bookings-list");
    bookingsList.innerHTML = ""; // Clear existing bookings

    if (bookings.length === 0) {
        bookingsList.innerHTML = "<p>No bookings yet.</p>";
        return;
    }

    bookings.forEach(booking => {
        const bookingItem = document.createElement("div");
        bookingItem.classList.add("booking-item");

        const resources = [];
        if (booking.resources.projector) resources.push("Projector");
        if (booking.resources.whiteboard) resources.push("Whiteboard");
        if (booking.resources.laptop) resources.push("Laptop");

        bookingItem.innerHTML = `
            <h4>${booking.room}</h4>
            <p><strong>Booked by:</strong> ${booking.name} (Office ID: ${booking.officeId})</p>
            <p><strong>From:</strong> ${booking.fromTime}</p>
            <p><strong>To:</strong> ${booking.toTime}</p>
            <p><strong>Resources:</strong> ${resources.join(", ")}</p>
        `;

        bookingsList.appendChild(bookingItem);
    });
}
