const tableUser = document.getElementById('tableUser');
const navbarUserInfo = document.getElementById('navbarUser');

fetch("http://localhost:8088/api/user")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        navbarUser(data);
        showUser(data);
    })

function navbarUser(user) {
    navbarUserInfo.innerHTML = `<span>${user.email}</span>
                                <span>with roles:</span>
                                <span>${rolesToString(user.roles)}</span>`
}

function showUser(user) {
    let dataOfUser = "";

    dataOfUser += `<tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.name}</td>
    <td>${user.age}</td>
    <td>${user.email}</td>
    <td>${rolesToString(user.roles)}</td>
    </tr>`;
    tableUser.innerHTML = dataOfUser;
}

function rolesToString(roles) {
    let rolesString = '';

    for(let el of roles) {
        rolesString += (el.name.toString().replace('ROLE_', ' ') + ' ');
    }

    return rolesString;
}