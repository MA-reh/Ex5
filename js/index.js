let formEle = document.querySelector("form"),
  formInputs = formEle.querySelectorAll("input"),
  id = 0,
  students = [],
  tbody = document.querySelector("tbody"),
  WarningP = document.querySelector("#DataStudent p.warning"),
  formBtn = formEle.querySelector("button.btn-add"),
  formBtnClear = formEle.querySelector("button.btn-clear"),
  inputSearch = document.querySelector("#Filter input"),
  popupModelDelete = document.querySelector("#popupDelete"),
  btnDelete = popupModelDelete.querySelector("#btnDelete"),
  popupModelEdit = document.querySelector("#popupEdit"),
  btnEdit = popupModelEdit.querySelector("#btnEdit");

(function () {
  // check if students found any student ? if n't doesn't do any things
  if (localStorage.getItem("students") == null) {
    localStorage.setItem("students", JSON.stringify(students));
    checkStudents(students);
  } else {
    students = JSON.parse(localStorage.getItem("students"));
    checkStudents(students);
  }

  // check if Number Id Of Students found any number ? if n't doesn't do any things
  if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", id);
  } else {
    id = +localStorage.getItem("id");
  }
  
  showAllStudents(students);
})();

formEle.addEventListener("submit", function (e) {
  // Don't do any form action by default
  e.preventDefault();
  

  if (formEle.dataset.type == "add") {
    // call function addStudent  
    addStudent();
  } else if (formEle.dataset.type == "edit") {
    // call function editStudentStatus  
    editStudentStatus();
  }
});

let allButtonRemoveStudents = tbody.querySelectorAll(".btn-remove");

let allButtonEditStudents = tbody.querySelectorAll(".btn-edit");

for (let formInput of formInputs) {
  // if user getOut focus in any input do function 
  formInput.addEventListener("blur", () => {
    checkInput(formInput);
  });
  
  // if user get keydown in any  
  formInput.addEventListener("keydown", () => {
    formBtnClear.classList.add("active");
  });
}

// Search Input
inputSearch.addEventListener("keydown", function () {
  let valueOfSearch = inputSearch.value.toLowerCase();

  let filteredStudents = students.filter((student) => {
    return (
      student.id.toString().includes(valueOfSearch) ||
      student.firstName.toLowerCase().includes(valueOfSearch) ||
      student.lastName.toLowerCase().includes(valueOfSearch) ||
      student.lastName.toLowerCase().includes(valueOfSearch) ||
      student.email.toLowerCase().includes(valueOfSearch) ||
      student.age.toLowerCase().includes(valueOfSearch) ||
      student.phone.toLowerCase().includes(valueOfSearch)
    );
  });

  showAllStudents(filteredStudents);
});
