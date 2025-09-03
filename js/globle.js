// get form value and set in object student
function getStudentStatus(idStudent) {
  let student = { id: idStudent };

  formInputs.forEach((formInput) => {
    let inputName = formInput.name,
      inputValue = formInput.value;

    student[inputName] = inputValue;
  });
  return student;
}

// show Row student in table
function showStudent(student) {
  tbody.innerHTML += `
            <tr data-student-id="${student.id}" >
              <th scope="row">${student.id}</th>
              <td>${student.firstName}</td>
              <td>${student.lastName}</td>
              <td>${student.email}</td>
              <td>${student.age}</td>
              <td>${student.phone}</td>
              <td>
                <button class="btn-edit btn btn-info text-light me-1 d-inline" data-value="edit" onclick="setStudent(${student.id}, this)">Edit</button>
                <button class="btn btn-danger btn-remove" onclick="openModelDelete(${student.id}, this)">Remove</button>
              </td>
            </tr>
    `;
}

// check input form is valid or not
function checkInput(input) {
  let inputName = input.name,
    inputValue = input.value,
    inputAlert = input.parentElement.nextElementSibling;
  let regex;

  if (inputName == "firstName" || inputName == "lastName") {
    regex = /^ ?[A-Za-z]+ ?$/;
  } else if (inputName == "email") {
    regex = /^[A-Za-z]{1}[A-Za-z0-9\-\.\_]+@(gmail.com|yahoo.org)$/;
  } else if (inputName == "age") {
    regex = /^[1-9]{1}[0-9]{1}$/;
  } else if (inputName == "phone") {
    regex = /^(02)?01(0|1|2|5)[0-9]{8}$/;
  }

  if (inputValue == "") {
    inputAlert.innerHTML = `
                <svg
                  class="bi flex-shrink-0 me-2"
                  role="img"
                  aria-label="Danger:"
                >
                  <use xlink:href="#exclamation-triangle-fill" />
                </svg> This field is required
`;
    inputAlert.classList.remove("d-none");

    input.classList.remove("is-valid");
    input.classList.remove("is-invalid");

    input.setAttribute("data-valid", false);
  } else if (!regex.test(inputValue)) {
    inputAlert.innerHTML = `<svg
          class="bi flex-shrink-0 me-2"
          role="img"
          aria-label="Danger:"
        >
          <use xlink:href="#exclamation-triangle-fill" />
        </svg>
        Invalid Field`;
    inputAlert.classList.remove("d-none");
    input.classList.add("is-invalid");
    input.setAttribute("data-valid", false);
  } else {
    inputAlert.classList.add("d-none");

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    formBtnClear.classList.remove("active");

    input.setAttribute("data-valid", true);
  }
}

// delete all rows in table and add all students in table again
function showAllStudents(currentStudents) {
  tbody.innerHTML = "";

  currentStudents.forEach((student) => {
    showStudent(student);
  });
}

// update in local storage
function updateLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("id", JSON.stringify(id));
}

// add new student in table in page
function addStudent() {
  if (formEle.querySelector("input:focus")) {
    formEle.querySelector("input:focus").blur();
  }

  for (let formInput of formInputs) {
    if (formInput.dataset.valid == "false") {
      return 0;
    }

    formInput.dataset.valid = false;

    setTimeout(() => {
      formInput.classList.remove("is-invalid");
      formInput.classList.remove("is-valid");
    }, 10);
  }

  let newStudent = getStudentStatus(++id);

  students.push(newStudent);

  checkStudents(students);

  updateLocalStorage();

  showStudent(newStudent);

  resetForm();
}

// open model and delete student
function openModelDelete(id, that) {
  popupModelDelete.classList.add("active");

  btnDelete.onclick = function (value) {
    if (value) {
      that.parentElement.parentElement.remove();
      popupModelDelete.classList.remove("active");

      students = students.filter((student) => {
        return student.id != id;
      });

      checkStudents(students);

      updateLocalStorage();
    } else {
    }
  };
}

// show status student in form to edited
function setStudent(idStudent, that) {
  resetForm();

  if (that.dataset.value == "edit") {
    let student = students.filter((student) => {
      return student.id == idStudent;
    })[0];
    for (let btn of allButtonEditStudents) {
      btn.dataset.value = "edit";
      btn.classList.replace("btn-primary", "btn-info");
      btn.textContent = "Edit";
      btn.dataset.value = "edit";
    }
    setTimeout(() => {
      that.classList.replace("btn-info", "btn-primary");
      that.textContent = "Undo";
      that.dataset.value = "undo";
    }, 10);
    formInputs.forEach((formInput) => {
      formInput.value = student[formInput.name];
    });

    formEle.dataset.type = "edit";

    formBtn.classList.replace("btn-success", "btn-info");
    formBtn.classList.add("text-light");
    formBtn.textContent = "Edit";

    for (let btnRemove of allButtonRemoveStudents) {
      btnRemove.setAttribute("disabled", true);
    }

    for (let btnEdit of allButtonEditStudents) {
      if (btnEdit.dataset.value == "edit") {
        btnEdit.setAttribute("disabled", true);
      }
    }

    that.removeAttribute("disabled");

    formEle.setAttribute("data-student-id", student.id);
  } else if (that.dataset.value == "undo") {
    that.classList.replace("btn-primary", "btn-info");
    that.textContent = "Edit";
    that.dataset.value = "edit";

    for (let btn of allButtonEditStudents) {
      btn.removeAttribute("disabled");
    }
    for (let btnRemove of allButtonRemoveStudents) {
      btnRemove.removeAttribute("disabled");
    }

    resetForm();

    formEle.dataset.type = "add";
    formBtn.classList.replace("btn-info", "btn-success");
    formBtn.textContent = "Add";
  }
}

// after click Edit button checked if you sure or not after that edited
function editStudentStatus() {
  popupModelEdit.classList.add("active");

  btnEdit.onclick = (e) => {
    if (formEle.querySelector("input:focus")) {
      formEle.querySelector("input:focus").blur();
    }

    for (let formInput of formInputs) {
      formInput.dataset.valid = true;

      if (formInput.dataset.valid == "false") {
        return 0;
      }
    }

    let idOfEditStudent = formEle.getAttribute("data-student-id");

    let updatedStudent = getStudentStatus(idOfEditStudent);

    let indexOfEditStudent = students.findIndex((student) => {
      return student.id == idOfEditStudent;
    });

    students[indexOfEditStudent] = updatedStudent;

    updateLocalStorage();

    document.querySelector(
      `tbody tr[data-student-id="${idOfEditStudent}"]`
    ).innerHTML = `
        <th scope="row">${updatedStudent.id}</th>
        <td>${updatedStudent.firstName}</td>
        <td>${updatedStudent.lastName}</td>
        <td>${updatedStudent.email}</td>
        <td>${updatedStudent.age}</td>
        <td>${updatedStudent.phone}</td>
        <td>
          <button class="btn-edit btn btn-info text-light me-1 d-inline" data-value="edit" onclick="setStudent(${updatedStudent.id}, this)">Edit</button>
          <button class="btn btn-danger btn-remove" onclick="deleteStudent(${updatedStudent.id}, this)">Remove</button>
        </td>
    `;

    document
      .querySelector(`tbody tr[data-student-id="${idOfEditStudent}"]`)
      .classList.add("table-success");

    setTimeout((e) => {
      document
        .querySelector(`tbody tr[data-student-id="${idOfEditStudent}"]`)
        .classList.remove("table-success");
    }, 1500);

    popupModelEdit.classList.remove("active");

    for (let btn of allButtonEditStudents) {
      btn.removeAttribute("disabled");
    }
    for (let btnRemove of allButtonRemoveStudents) {
      btnRemove.removeAttribute("disabled");
    }

    resetForm();
  };
}

// Reset All settings for Form to default
function resetForm() {
  formEle.dataset.type = "add";

  formBtn.classList.replace("btn-info", "btn-success");
  formBtn.textContent = "Add";

  formBtnClear.classList.remove("active");
  for (let formInput of formInputs) {
    let inputAlert = formInput.parentElement.nextElementSibling;

    formInput.classList.remove("is-invalid");
    formInput.classList.remove("is-valid");
    inputAlert.classList.add("d-none");
  }

  formEle.reset();
}

// check allStudents if his founded hidden Warning P if n't show warning
function checkStudents(students) {
  if (students == "") {
    WarningP.classList.remove("d-none");
  } else if (students != "") {
    WarningP.classList.add("d-none");
  }
}

// close Model Delete
function CloseModelDelete() {
  popupModelDelete.classList.remove("active");
}

// close Model Edit
function CloseModelEdit() {
  popupModelEdit.classList.remove("active");
}
