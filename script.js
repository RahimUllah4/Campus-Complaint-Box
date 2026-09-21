// Get elements from HTML
const complaintForm = document.getElementById("complaintForm");
const complaintsList = document.getElementById("complaintsList");
const searchInput = document.getElementById("searchInput");

const totalComplaints = document.getElementById("totalComplaints");
const pendingComplaints = document.getElementById("pendingComplaints");
const progressComplaints = document.getElementById("progressComplaints");
const resolvedComplaints = document.getElementById("resolvedComplaints");

// Get saved complaints from browser
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];


// Submit complaint
complaintForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const studentName = document.getElementById("studentName").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    const complaint = {
        id: Date.now(),
        studentName: studentName,
        rollNumber: rollNumber,
        category: category,
        description: description,
        date: new Date().toLocaleDateString(),
        status: "Pending"
    };

    complaints.push(complaint);

    saveComplaints();

    complaintForm.reset();

    displayComplaints();
    updateDashboard();
});


// Save complaints in browser
function saveComplaints() {
    localStorage.setItem("complaints", JSON.stringify(complaints));
}


// Display complaints
function displayComplaints(searchText = "") {

    complaintsList.innerHTML = "";

    const filteredComplaints = complaints.filter(function (complaint) {

        return (
            complaint.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
            complaint.rollNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            complaint.category.toLowerCase().includes(searchText.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchText.toLowerCase())
        );

    });


    if (filteredComplaints.length === 0) {

        complaintsList.innerHTML =
            "<p>No complaints found.</p>";

        return;
    }


    filteredComplaints.forEach(function (complaint) {

        const complaintDiv = document.createElement("div");

        complaintDiv.className = "complaint";

        complaintDiv.innerHTML = `
            <h3>${complaint.category}</h3>

            <p><strong>Student:</strong> ${complaint.studentName}</p>

            <p><strong>Roll Number:</strong> ${complaint.rollNumber}</p>

            <p><strong>Description:</strong> ${complaint.description}</p>

            <p><strong>Date:</strong> ${complaint.date}</p>

            <select onchange="changeStatus(${complaint.id}, this.value)">
    <option value="Pending" ${complaint.status === "Pending" ? "selected" : ""}>
        Pending
    </option>

    <option value="In Progress" ${complaint.status === "In Progress" ? "selected" : ""}>
        In Progress
    </option>

    <option value="Resolved" ${complaint.status === "Resolved" ? "selected" : ""}>
        Resolved
    </option>
</select>

            <br>

            <button class="delete-btn"
                onclick="deleteComplaint(${complaint.id})">
                Delete
            </button>
        `;

        complaintsList.appendChild(complaintDiv);

    });
}


// Delete complaint
function deleteComplaint(id) {

    complaints = complaints.filter(function (complaint) {
        return complaint.id !== id;
    });

    saveComplaints();

    displayComplaints();
    updateDashboard();
}


// Update dashboard numbers
function updateDashboard() {

    totalComplaints.textContent = complaints.length;

    pendingComplaints.textContent =
        complaints.filter(c => c.status === "Pending").length;

    progressComplaints.textContent =
        complaints.filter(c => c.status === "In Progress").length;

    resolvedComplaints.textContent =
        complaints.filter(c => c.status === "Resolved").length;
}


// Search complaints
searchInput.addEventListener("input", function () {

    displayComplaints(searchInput.value);

});


// Show saved complaints when page opens
displayComplaints();
updateDashboard();
// Change complaint status
function changeStatus(id, newStatus) {

    const complaint = complaints.find(function (complaint) {
        return complaint.id === id;
    });

    if (complaint) {
        complaint.status = newStatus;
    }

    saveComplaints();

    displayComplaints(searchInput.value);
    updateDashboard();
}