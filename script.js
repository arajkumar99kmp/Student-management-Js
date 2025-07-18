// Student data array
let students = [];
let currentStudentId = null;

// DOM elements
const studentIdInput = document.getElementById('student-id');
const studentNameInput = document.getElementById('student-name');
const studentAgeInput = document.getElementById('student-age');
const studentGradeInput = document.getElementById('student-grade');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resetSearchBtn = document.getElementById('reset-search-btn');
const studentsTable = document.getElementById('students-table');
const studentsTableBody = document.getElementById('students-table-body');
const statusMessage = document.getElementById('status-message');
const noResultsMessage = document.getElementById('no-results');

// Event listeners
saveBtn.addEventListener('click', saveStudent);
cancelBtn.addEventListener('click', resetForm);
searchBtn.addEventListener('click', searchStudents);
resetSearchBtn.addEventListener('click', resetSearch);

// Initialize the app
function init() {
    // Load sample data or from localStorage if available
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    } else {
        // Sample data
        students = [
            { id: 'S001', name: 'Name-1', age: 20, grade: 'A' },
            { id: 'S002', name: 'Name-2', age: 21, grade: 'B' },
            { id: 'S003', name: 'Name--3', age: 19, grade: 'C' }
        ];
        saveToLocalStorage();
    }
    
    // Show no results message by default
    noResultsMessage.style.display = 'block';
    studentsTable.style.display = 'none';
}

// Save student to the array
function saveStudent() {
    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const age = studentAgeInput.value.trim();
    const grade = studentGradeInput.value.trim();

    if (!id || !name || !age || !grade) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Validate ID format (S followed by 3 digits)
    if (!/^S\d{3}$/.test(id)) {
        showMessage('Student ID must be in format S001 (S followed by 3 digits)', 'error');
        return;
    }

    // Check for duplicate ID when adding new student
    if (currentStudentId === null && students.some(s => s.id === id)) {
        showMessage('Student ID already exists', 'error');
        return;
    }

    const student = { id, name, age, grade };

    if (currentStudentId === null) {
        // Add new student
        students.push(student);
        showMessage('Student added successfully!', 'success');
    } else {
        // Update existing student
        const index = students.findIndex(s => s.id === currentStudentId);
        if (index !== -1) {
            students[index] = student;
            showMessage('Student updated successfully!', 'success');
        }
    }

    saveToLocalStorage();
    resetForm();
}

// Render students in the table
function renderStudents(data = students) {
    studentsTableBody.innerHTML = '';
    
    if (data.length === 0) {
        studentsTable.style.display = 'none';
        noResultsMessage.style.display = 'block';
        return;
    }
    
    data.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>
                <button class="action-btn edit" data-id="${student.id}">Edit</button>
                <button class="action-btn delete" data-id="${student.id}">Delete</button>
            </td>
        `;
        
        studentsTableBody.appendChild(row);
    });

    studentsTable.style.display = 'table';
    noResultsMessage.style.display = 'none';

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', editStudent);
    });
    
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', deleteStudent);
    });
}

// Edit student
function editStudent(e) {
    const id = e.target.getAttribute('data-id');
    const student = students.find(s => s.id === id);
    
    if (student) {
        currentStudentId = student.id;
        studentIdInput.value = student.id;
        studentNameInput.value = student.name;
        studentAgeInput.value = student.age;
        studentGradeInput.value = student.grade;
        
        // Disable ID field when editing
        studentIdInput.disabled = true;
        showMessage('Editing student: ' + student.name, 'success');
    }
}

// Delete student
function deleteStudent(e) {
    if (confirm('Are you sure you want to delete this student?')) {
        const id = e.target.getAttribute('data-id');
        const studentName = students.find(s => s.id === id)?.name;
        students = students.filter(s => s.id !== id);
        saveToLocalStorage();
        
        // Hide table if no students left
        if (students.length === 0) {
            studentsTable.style.display = 'none';
            noResultsMessage.style.display = 'block';
        } else {
            renderStudents();
        }
        
        if (currentStudentId === id) {
            resetForm();
        }
        
        showMessage(`Student "${studentName}" deleted successfully`, 'success');
    }
}

// Search students
function searchStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        showMessage('Please enter a search term', 'error');
        return;
    }
    
    const filteredStudents = students.filter(student => 
        student.id.toLowerCase().includes(searchTerm) || 
        student.name.toLowerCase().includes(searchTerm)
    );
    
    renderStudents(filteredStudents);
    
    if (filteredStudents.length === 0) {
        showMessage('No students found matching your search', 'error');
        studentsTable.style.display = 'none';
        noResultsMessage.style.display = 'block';
    } else {
        showMessage(`Found ${filteredStudents.length} student(s)`, 'success');
    }
}

// Reset search
function resetSearch() {
    searchInput.value = '';
    if (students.length > 0) {
        renderStudents();
        showMessage('Showing all students', 'success');
    } else {
        studentsTable.style.display = 'none';
        noResultsMessage.style.display = 'block';
    }
}

// Reset form
function resetForm() {
    currentStudentId = null;
    studentIdInput.value = '';
    studentNameInput.value = '';
    studentAgeInput.value = '';
    studentGradeInput.value = '';
    studentIdInput.disabled = false;
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Show status message
function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }, 3000);
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', init);