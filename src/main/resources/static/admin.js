const navbarAdminInfo = document.getElementById('navbarAdmin');
const tableUsers = document.getElementById('tableUsers');
const tableAdmin = document.getElementById('tableAdmin');
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let editModal = new bootstrap.Modal(document.getElementById('editModal'));


fetch("http://localhost:8088/api/admin/showUser")
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        navbarAdmin(data);
        showUser(data);
    })

function navbarAdmin(user) {
    navbarAdminInfo.innerHTML = `<span>${user.email}</span>
                                <span>with roles:</span>
                                <span>${user.roles.map(role=>role.name.substring(5))}</span>`
}

function showUser(user) {
    let dataOfUser = "";

    dataOfUser += `<tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.name}</td>
    <td>${user.age}</td>
    <td>${user.email}</td>
    <td>${user.roles.map(role=>role.name.substring(5))}</td>
    </tr>`;
    tableAdmin.innerHTML = dataOfUser;
}

function rolesToString(roles) {
    let rolesString = '';
    for (let el of roles) {
        rolesString += (el.name.toString().replace('ROLE_', ' ') + ' ');
    }
    return rolesString;
}

function rolesUser(event) {
    let rolesAdmin = {};
    let rolesUser = {};
    let roles = [];
    let allRoles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push(sel.options[i].value);
        }
    }
    if (roles.includes('1')) {
        rolesAdmin["id"] = 1;
        rolesAdmin["name"] = "ROLE_ADMIN";
        allRoles.push(rolesAdmin);
    }
    if (roles.includes('2')) {
        rolesUser["id"] = 2;
        rolesUser["name"] = "ROLE_USER";
        allRoles.push(rolesUser);
    }
    return allRoles;
}

showAllUsers();

function showAllUsers() {
    fetch("http://localhost:8088/api/admin")
        .then(res => res.json())
        .then(users => {
            let dataOfUsers = "";
            console.log(users);
            for (let user of users) {
                dataOfUsers +=`<tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role=>role.name.substring(5))}</td>
    
                    <td>
                        <button type="button" id="edit" class="btn btn-info" data-bs-toggle="modal"
                        onclick='showEditModal(${user.id})'>
                            Edit
                        </button>
                    </td>
    
                    <td>
                        <button id="delete" type="button" class="btn btn-danger" 
                        data-toggle="modal" onclick='showDeleteModal(${user.id})'>
                            Delete
                        </button>
                        
                    </td>
                </tr>`;
            }
        tableUsers.innerHTML = dataOfUsers;
    })

}

let formNew = document.forms["formNew"];
let usersTable = document.getElementById("usersTable");

createUser();

function createUser() {
    formNew.addEventListener("submit", ev => {
        ev.preventDefault();

            fetch("http://localhost:8088/api/admin/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formNew.username.value,
                name: formNew.name.value,
                age: formNew.age.value,
                email: formNew.email.value,
                password: formNew.password.value,
                roles: rolesUser("#create-roles")
            })
        }).then(() => {
            formNew.reset();
            showAllUsers();
            usersTable.click();
        })
    });
}

function getRoles(list) {
    let userRoles = [];
    for (let role of list) {
        if (role == 1 || role.id == 1) {
            userRoles.push("ADMIN");
        }
        if (role == 2 || role.id == 2) {
            userRoles.push("USER");
        }
    }
    return userRoles.join(" , ");
}

function showDeleteModal(id) {
    document.getElementById('deleteClose').setAttribute('onclick', () => {
        deleteModal.hide();
        document.getElementById('deleteUser').reset();
    });

    let request = new Request("http://localhost:8088/api/admin/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request).then(res => res.json()).then(deleteUser => {
            console.log(deleteUser);
            document.getElementById('delete-id').setAttribute('value', deleteUser.id);
            document.getElementById('delete-firstname').setAttribute('value', deleteUser.username);
            document.getElementById('delete-lastname').setAttribute('value', deleteUser.name);
            document.getElementById('delete-age').setAttribute('value', deleteUser.age);
            document.getElementById('delete-email').setAttribute('value', deleteUser.email);
            document.getElementById('delete-password').setAttribute('value', deleteUser.password);
        if (getRoles(deleteUser.roles).includes("USER") && getRoles(deleteUser.roles).includes("ADMIN")) {
            document.getElementById('rolesDelete1').setAttribute('selected', 'true');
            document.getElementById('rolesDelete2').setAttribute('selected', 'true');
        } else if (getRoles(deleteUser.roles).includes("ADMIN")) {
            document.getElementById('rolesDelete1').setAttribute('selected', 'true');
        } else if (getRoles(deleteUser.roles).includes("USER")) {
            document.getElementById('rolesDelete2').setAttribute('selected', 'true');
        }
            deleteModal.show();
        }
    );
    var isDelete = false;
    document.getElementById('deleteUser').addEventListener('submit', event => {
        event.preventDefault();
        if (!isDelete) {
            isDelete = true;
            let request = new Request('http://localhost:8088/api/admin/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetch(request).then(() => {
                showAllUsers();
            });
            document.getElementById('deleteUser').reset();
        }

        deleteModal.hide();
    });
}

function showEditModal(id) {
    let request = new Request("http://localhost:8088/api/admin/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(res => res.json()).then(editUser => {
        document.getElementById('edit-id').setAttribute('value', editUser.id);
        document.getElementById('edit-firstname').setAttribute('value', editUser.username);
        document.getElementById('edit-lastname').setAttribute('value', editUser.name);
        document.getElementById('edit-age').setAttribute('value', editUser.age);
        document.getElementById('edit-email').setAttribute('value', editUser.email);
        document.getElementById('edit-password').setAttribute('value', editUser.password);
            if ((editUser.roles.map(role => role.id)) == 1 && ((editUser.roles.map(role => role.id)) == 2)) {
                document.getElementById('rolesEdit1').setAttribute('selected', 'true');
                document.getElementById('rolesEdit2').setAttribute('selected', 'true');
            } else if ((editUser.roles.map(role => role.id)) == 1) {
                document.getElementById('rolesEdit1').setAttribute('selected', 'true');
            } else if (editUser.roles.map(role => role.id) == 2) {
                document.getElementById('rolesEdit2').setAttribute('selected', 'true');
            }
            console.log(editUser)
            editModal.show();
        }
    );

    document.getElementById('editUser').addEventListener('submit', submitFormEditUser);
}

function submitFormEditUser(event) {
    event.preventDefault();
    let editUserForm = new FormData(event.target);
    let user = {
        id: editUserForm.get('id'),
        username: editUserForm.get('username'),
        name: editUserForm.get('name'),
        age: editUserForm.get('age'),
        email: editUserForm.get('email'),
        password: editUserForm.get('password'),
        roles: rolesUser("#edit-roles")
    }
    console.log(user);
    let request = new Request('http://localhost:8088/api/admin', {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(
        function (response) {
            console.log(response)
            showAllUsers();
            event.target.reset();
            editModal.hide();
        });

}