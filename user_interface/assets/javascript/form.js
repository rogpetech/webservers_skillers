const BASE_URL = "http://localhost:8087";


async function handleDelete(path, id) {
  try{
    await fetch(`${BASE_URL}${path}/${id}`, { method: "DELETE" });
    fetchData(path, `${path.slice(1)}-list`);
    closeModal('editModal');
  }catch(error){
    console.error("Failed to delete data: ", error);
  }
}

function confirmDelete(path, id) {
  debugger
  const confirmButon = document.getElementById("confirmDelete");
  confirmButon.onclick = (event) => {
    event.preventDefault();
    handleDelete(path, id);
  }
  document.getElementById("deleteModal").classList.remove("hidden");
}

async function handleSubmit(event, path, fields, listId, selectIds = []) {
  event.preventDefault();
  const formData = {};

  fields.forEach(field => {
    const element = document.getElementById(field);

    if(element) {
      const listReplaced = `${listId.split('-')[0]}-`;
      const fieldReplaced = field.replace(listReplaced,'');
      formData[fieldReplaced] = element.value;
    }
  });

  try {
    await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });
    fetchData(path, listId);
    fields.forEach( field => {
      document.getElementById(field).value = '';
    });

    selectIds.forEach( selectId => {
      fetchData(path, listId, selectId);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderThViewForTable(attributes) {
  thHTML = "";
  attributes.forEach( attribute => {
    thHTML += `<th class="px-4 py-2">${attribute}</th>\n`;
  });
  const theader = `<thead>
     <tr>
       ${thHTML}
     </tr>
   </thead>`;
  
  return theader;
}

function validateUndefinedAttributes(attribute){
  if(attribute === undefined) {
    return "";
  }
  return attribute;
}

function renderBodyTable(attributes, type = null, path, created_at = null, updated_at = null) {
  console.log(attributes, type)
  tdTable = "";

  attributes.forEach(attribute => {
    tdTable += `<td class="border px-4 py-2">${attribute}</td>`;
  });

  if(type === 'user-list'){
    return `
     ${tdTable}
    <td class="border px-4 py-2">
      <button onclick="openEditModal('${path}', ${attributes[0]})" class="btn">Edit</button>
      <button onclick="confirmDelete('${path}', ${attributes[0]})" class="btn">Delete</button>
    </td>`;
  }

  return `
      ${tdTable}
      <td class="border px-4 py-2">${new Date(created_at).toLocaleString('pt-BR')}</td>
      <td class="border px-4 py-2">${new Date(updated_at).toLocaleString('pt-BR')}</td>
      <td class="border px-4 py-2">
        <button onclick="openEditModal('${path}', ${attributes[0]})" class="btn">Edit</button>
        <button onclick="confirmDelete('${path}', ${attributes[0]})" class="btn">Delete</button>
    </td>
  `

}

async function fetchData(path, listId, selectId = null) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const data = await response.json();
    const listElement = document.getElementById(listId);

    let tableHeader = '';
    switch(listId) {
      case 'user-list':
        tableHeaderUserAttributes = ["ID", "Name", "Email", "Action"];
        tableHeader = renderThViewForTable(tableHeaderUserAttributes);
        break;
      case 'course-list':
        tableHeaderUserAttributes = ["ID", "Title", "Description", "Created at", "Updated at","Action"];
        tableHeader = renderThViewForTable(tableHeaderUserAttributes);
        break;
      case 'lesson-list':
        tableHeaderUserAttributes = ["ID", "Course Id", "Title", "Description", "Created at", "Updated at","Action"];
        tableHeader = renderThViewForTable(tableHeaderUserAttributes);
        break;
      case 'attendance-list':
        tableHeaderUserAttributes = ["ID", "Lesson Id", "User Id", "Created at", "Updated at","Action"];
        tableHeader = renderThViewForTable(tableHeaderUserAttributes);
        break;
      case 'score-list':
        tableHeaderUserAttributes = ["ID", "User Id", "Video", "Created at", "Updated at","Action"];
        tableHeader = renderThViewForTable(tableHeaderUserAttributes);
        break;
    }

    listElement.innerHTML = tableHeader;

    data.forEach( item => {
      const row = document.createElement('tr');

      switch(listId) {
        case 'user-list':
          const userAttributes = [item?.id, item?.name, item?.email];
          row.innerHTML = renderBodyTable(userAttributes, type = 'user-list', path);
            break;
        case 'course-list':
          const courseAttributes = [item?.id, item?.title, item?.description];
          row.innerHTML = renderBodyTable(courseAttributes, type = 'course-list', path, item.created_at, item.updated_at);
          break;
        case 'lesson-list':
          const lessonAttributes = [item?.id, item?.course_id, item?.title, item?.description];
          row.innerHTML = renderBodyTable(lessonAttributes, type = '', path, item.created_at, item.updated_at);
          break;
        case 'attendance-list':
          const attendanceAttributes = [item?.id, item?.course_id, item?.title, item.description];
          row.innerHTML = renderBodyTable(attendanceAttributes, type = '', path, item.created_at, item.updated_at);
          break;
        case 'score-list':
          const scoreAttributes = [item?.id, item?.user_id, item?.video, item?.description];
          row.innerHTML = renderBodyTable(scoreAttributes, type = '', path, item.created_at, item.updated_at);
        default:
          break;
      }

      listElement.appendChild(row);
    });

    if(selectId) {
      const selectElement = document.getElementById(selectId);
      selectElement.innerHTML = '';
      data.forEach( item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

function showFormById(formId) {
  document.getElementById(formId).classList.toggle('hidden');
}

function onSubmitForm(idByForm, path, attributes, idTableList) {
  document.getElementById(idByForm).onsubmit = (event) => { 
    handleSubmit(event, path, attributes, idTableList);
  };
}

async function handleUpdate(event, path, id) {
  event.preventDefault();

  const formData = {};
  Array.from(event.target.elements).forEach( element => {
    if(element.id.starsWith("edit-")){
      const key = element.id.replace("edit-", "");
      formData[key] = element.value;
    }
  });

  try{
    await fetch(`${BASE_URL}/${path}/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData)
    });
    fetchData(path, `${path.slice(1)}-list`);
    closeModal('editModal');

  }catch(error){
    console.error("Failed to update data:",error);
  }

}

async function openEditModal(path, id) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const data = await response.json();
    const form = document.getElementById("edit-form");
    Object.keys(data).forEach(key => {
      if(key !== "id" && key !== "created_at" && key !== "updated_at" ){
        const label = document.createElement("label");
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
        form.appendChild(label);
        const input = document.createElement("input");
        input.type = "text"
        input.id = `edit-${key}`
        input.className = "input-field";
        input.value = data[key];
        form.appendChild(input);
      }
    });

    const updateButton = document.createElement("button");
    updateButton.type = "submit";
    updateButton.className = "btn";
    updateButton.textContent = "Update";
    form.appendChild(updateButton);
    form.onsubmit = (event) => handleUpdate(event, path, id);

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn"
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => closeModal('editModal');
  }catch(error){
    console.error("Failed to open edit modal:", error);
  }
}

onSubmitForm("user-form", "/users", ["user-name", "user-email"], "user-list");
onSubmitForm("course-form", "/courses", ["course-title", "course-description"], "course-list");
onSubmitForm("lesson-form", "/lessons", ["lesson-title", "lesson-description", "lesson-course-id"],
"lesson-list");
onSubmitForm("attendance-form", "/attendances", ["attendance-lesson-id", "attendance-user-id"], "attendance-list");
onSubmitForm("score-form", "/scores", ["score-user-id", "score-video", "score-points"], "score-list");
