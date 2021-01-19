document.addEventListener('DOMContentLoaded', ()=>{
    console.log('HTML is loaded!! good luck Texas SE-082420!')
    getInstructors()
    document.querySelector('#person-form').addEventListener('submit', (event) => {
        event.preventDefault()
        addNewPerson(event.target)
    })
})

function getInstructors() {
    fetch("http://localhost:3000/people")
        .then(res => res.json())
        .then(instructorObj => instructorObj.forEach(function(instructor) {
            renderInstructor(instructor)
        }))
}

function renderInstructor(instructor) {
    pplContainer = document.querySelector('#people')
    card = document.createElement('div')
    card.className = "card p-2 m-2"
    card.style = "width: 18rem;"
    image = document.createElement('img')
    image.src = instructor.profilePicture
    image.className = "card-img-top"
    cardBody = document.createElement('div')
    cardBody.className = "card-body"
    h5 = document.createElement('h5')
    h5.className = "card-title"
    h5.innerText = instructor.name
    h5.id = instructor.id
    title = document.createElement('p')
    title.className = "card-text"
    if (instructor["instructor?"] === true || instructor["instructor?"] === "true") {
        title.innerText = "Instructor"
        image.alt = `${instructor.name.split(" ")}, instructor`
    } else {
        image.alt = `${instructor.name.split(" ")}, alum`
    }
    pronouns = document.createElement('p')
    pronouns.className = "card-text"
    pronouns.innerText = `Preferred Pronouns: ${instructor.pronouns}`
    alumStatus = document.createElement('p')
    alumStatus.className = "card-text"
    if (instructor["alum?"] === true || instructor["alum?"] === "true") {
        alumStatus.innerText = "Attended Flatiron? Yes"
    } else {
        alumStatus.innerText = "Attended Flatiron? No"
    }
    github = document.createElement('a')
    github.href = instructor.github
    github.classList.add("btn", "btn-primary")
    github.innerText = `Go to ${instructor.name.split(" ")[0]}'s Github`
    const editFormContainer = document.createElement('div')
        editFormContainer.className = "form-container p-5 mx-auto col-4"
    const editForm = document.createElement('form')
        editForm.id = "edit-person-form"
        editForm.classList.add("collapse", "multi-collapse")
        editForm.addEventListener('submit', (event) => {
            event.preventDefault()
            editPerson(event.target, instructor)
        })
    let br = document.createElement('br')
    const div = document.createElement('div')
        div.className = "form-group"
    const label = document.createElement('label')
        label.setAttribute("for", "Name")
        label.innerText = "Name"
    const input = document.createElement('input')
        input.setAttribute("type", "text")
        input.className = "form-control"
        input.id = "name"
        input.setAttribute("aria-describedby", "nameInput")
    div.append(label, input)
    const btn = document.createElement('button')
        btn.setAttribute("type", "submit")
        btn.classList.add("btn", "btn-primary")
        btn.innerText = "Submit Changes"
    editForm.append(br, div, btn)
    
    const updateBtn = document.createElement('a')
        updateBtn.classList.add("btn", "btn-primary")
        updateBtn.setAttribute("data-toggle", "collapse")
        updateBtn.href = "#edit-person-form"
        updateBtn.setAttribute("role", "button")
        updateBtn.setAttribute("aria-expanded", "false")
        updateBtn.setAttribute("aria-controls", "collapseFormButton")
        updateBtn.innerText = "Edit Profile"

    editFormContainer.append(updateBtn, editForm)

    cardBody.append(h5, title, pronouns, alumStatus, github)
    card.append(image, cardBody, updateBtn, editForm)
    pplContainer.appendChild(card)
}

function addNewPerson(form) {
    newPerson = {
        name: form.name.value,
        pronouns: form.pronouns.value,
        "alum?": form.alum.value,
        "instructor?": form.instructor.value,
        github: form.github.value,
        profilePicture: form.profile.value
    }

    reqPackage = {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(newPerson)
    }

    fetch("http://localhost:3000/people", reqPackage)
        .then(res => res.json())
        .then(person => renderInstructor(person))
}

function editPerson(form, instructor) {
    let editValue = {
        name: form.name.value
    }

    let reqPackage = {
        headers: {
            "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(editValue)
    }

    fetch(`http://localhost:3000/people/${instructor.id}`, reqPackage)
        .then(res => res.json())
        .then(res => {
            document.getElementById(`${res.id}`).innerText = editValue.name
        })

    document.getElementById("edit-person-form").reset()
}