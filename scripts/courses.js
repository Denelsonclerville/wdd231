// data is loaded from course-data.js
// ensure courseData is defined before this script executes



function displayCourses(filter) {
    const courseContainer = document.getElementById("course-container");
    courseContainer.innerHTML = ""; // Clear previous content

    const filteredCourses = filterCourses(filter);
    filteredCourses.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("course-card");
        courseCard.innerHTML = `
            <h3>${course.name}</h3>
            <p>Credits: ${course.credits}</p>
            <p class="${course.completed ? 'completed' : 'not-completed'}">
                ${course.completed ? 'Completed' : 'Not Completed'}
            </p>
        `;
        courseContainer.appendChild(courseCard);
    });

    updateTotalCredits(filteredCourses);
}

function filterCourses(filter) {
    if (filter === "all") {
        return courseData;
    } else if (filter === "wdd") {
        return courseData.filter(course => course.name.startsWith("WDD"));
    } else if (filter === "cse") {
        return courseData.filter(course => course.name.startsWith("CSE"));
    }
    return [];
}

function updateTotalCredits(courses) {
    const totalCredits = courses.reduce((total, course) => total + course.credits, 0);
    document.getElementById("total-credits").innerText = `Total Credits: ${totalCredits}`;
}

// Event listeners for filter buttons
document.getElementById("all-courses").addEventListener("click", () => displayCourses("all"));
document.getElementById("wdd-courses").addEventListener("click", () => displayCourses("wdd"));
document.getElementById("cse-courses").addEventListener("click", () => displayCourses("cse"));

// Initial display of all courses
displayCourses("all");