let name = document.querySelector("#name");
let male = document.querySelector("#mister");
let female = document.querySelector("#miss");
let email = document.querySelector("#email");
let card = document.querySelector("#card");
let ID = document.querySelector("#ID");
let check = document.querySelector("#check");
let operateBtn = document.querySelector("#operateBtn");
let tableBody = document.querySelector(".tableBody");
let userNum = document.querySelector("#usersNum");
let vali = document.querySelector(".validate");
let inputSearch = document.querySelector("#Search");
let IDnum;
let EditNow = false;


let nameValidation = document.querySelector(".nameVali");
let emailValidation = document.querySelector(".emailVali");
let phoneValidation = document.querySelector(".phoneVali");
let nameStatus = false;
let emailStatus = false;
let phoneStatus = false;


if (localStorage.getItem("ID") != null) {
   IDnum = localStorage.getItem("ID");
}
else {
   IDnum = 0;
   localStorage.setItem("ID" , 0);
}
let userArr;
if(localStorage.getItem("ContactInfos") != null)
{
   userArr = JSON.parse(localStorage.getItem("ContactInfos"));
}
else
{
   userArr = [];
   localStorage.setItem("ContactInfos",JSON.stringify(userArr));
}

operateBtn.addEventListener("click", createUser);
inputSearch.addEventListener("input", () => showSearchUser(inputSearch.value));
//inputSearch.addEventListener("change",()=> showSearchUser(inputSearch.value));
name.addEventListener("input" , ValidateName);
email.addEventListener("input" , ValidateEmail);
card.addEventListener("input",ValidatePhone);
showUser();


function User(name, male, email, card, check) {
   this.UserID = IDnum++;
   localStorage.setItem("ID", IDnum);
   this.name = name.value.trim();
   this.gender = male.checked ? "Mr" : "Ms";
   this.email = email.value.trim();
   this.card = card.value.trim();
   this.check = check.checked;
}

function ValidateName()
{
   let nameRegex = /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:[' -][a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)?(?: [a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:[' -][a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)?)?$/;
   nameStatus = nameRegex.test(name.value.trim());
   nameValidation.innerHTML = nameStatus ? "" : "Enter a valid name";
   return nameStatus;
}

function ValidateEmail()
{
   let emailRegex = /^[a-zA-Z0-9._%+-]+(?:[a-zA-Z0-9-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/
   emailStatus = emailRegex.test(email.value.trim());
   emailValidation.innerHTML = emailStatus ? "" : "Enter a valid email";
   return emailStatus;
}

function ValidatePhone()
{
   let phoneRegex = /^(?:\+[0-9]\s?){0,3}(?:[0-9]\s?){1,14}$/
   phoneStatus = phoneRegex.test(card.value.trim());
   phoneValidation.innerHTML = phoneStatus ? "" : "Enter a valid phone number";
   return phoneStatus;
}

function ValiditeAll() {
   ValidateEmail();
   ValidatePhone();
   ValidateName();
   return ValidateEmail() && ValidatePhone() && ValidateName();
}

function resetFields() {
   name.value = "";
   email.value = "";
   male.checked = true;
   female.checked = false;
   card.value = "";
   check.checked = false;
}

function createUser() {

   let newUser = new User(name, male, email, card, check);
   if (ValiditeAll()) {
      vali.setAttribute("style", "display:none;");
      userArr.push(newUser);
      localStorage.setItem("ContactInfos", JSON.stringify(userArr));
      resetFields();
      showUser();
   }
}

function editUser(e) {
   let IDNow = e.currentTarget.parentElement.parentElement.childNodes[0].innerText;
   console.log("HI")
   if (EditNow == false) {
      EditNow = true;
      
      for(let user of userArr)
      {
         if(user.UserID == IDNow)
         {
            operateBtn.classList.remove("btn-dark");
            operateBtn.classList.add("btn-danger");
            operateBtn.value = "Edit User";
            operateBtn.removeEventListener("click", createUser);
            ID.value = user.UserID;
            name.value = user.name;
            if (user.gender == "Mr") {
               male.checked = true;
               female.checked = false;
            }
            else {
               female.checked = true;
               male.checked = false;
            }
            email.value = user.email;
            card.value = user.card;
            check.checked = user.check;
            operateBtn.addEventListener("click",editUserAction);
         }
      }
      
   }
   else {
      vali.innerHTML = "YOU CANNOT EDIT/DELETE AGAIN UNLESS YOU FINISH YOUR CURRENT EDIT/DELETE STOP MAKING MY LIFE HARDER";
      vali.setAttribute("style", "display:block;");
   }
}

function editUserAction(e) {
   if (ValiditeAll()) {
      vali.setAttribute("style", "display:none;");
      for (let user of userArr) {
         if (user.UserID == ID.value) {
            user.name = name.value.trim();
            user.gender = male.checked ? "Mr" : "Ms";
            user.email = email.value.trim();
            user.card = card.value.trim();
            user.check = check.checked;
            operateBtn.classList.remove("btn-danger");
            operateBtn.classList.add("btn-dark");
            operateBtn.value = "Add User";
            operateBtn.addEventListener("click", createUser);
            operateBtn.removeEventListener("click", editUserAction);
            localStorage.setItem("ContactInfos", JSON.stringify(userArr));
            vali.setAttribute("style", "display:none;");
            vali.innerHTML = "";
            resetFields();
            showUser();
            break;
         }
      }
      EditNow = false;

   }

}

function deletusUser(e) {
   let IDNow = e.currentTarget.parentElement.parentElement.childNodes[0].innerText;
   
   if (EditNow == false) {
      for(let user in userArr)
      {
         if(userArr[user].UserID == IDNow)
         {
            userArr.splice(user,1);
            e.currentTarget.parentElement.parentElement.remove();
         }
      }
      localStorage.setItem("ContactInfos", JSON.stringify(userArr));
      showUser();
   }
   else {
      vali.innerHTML = "YOU CANNOT EDIT/DELETE AGAIN UNLESS YOU FINISH YOUR CURRENT EDIT/DELETE";
      vali.setAttribute("style", "display:inline-block;");
   }
}

function showUser() {
   tableBody.innerHTML = "";
   userArr = localStorage.getItem("ContactInfos") ? JSON.parse(localStorage.getItem("ContactInfos")) : [];
   userArr.forEach((x, y) => {
      createTableElement(x, y);
   })
   userNum.innerHTML = userArr.length;
}

function showSearchUser(nameSearch) {
   tableBody.innerHTML = "";
   let count = 0;
   userArr = localStorage.getItem("ContactInfos") ? JSON.parse(localStorage.getItem("ContactInfos")) : [];
   userArr.forEach((x, y) => {
      if (x.name.toLowerCase().includes(nameSearch.toLowerCase()) || nameSearch == "") {
         createTableElement(x, y);
         count++;
      }
   })
   userNum.innerHTML = count;
}

function createTableElement(user) {

   let IDTD = document.createElement("td");
   IDTD.innerHTML = `${user.UserID}`;
   IDTD.setAttribute("style","display:none");

   let nameTd = document.createElement("td");
   nameTd.innerHTML = `${user.gender} ${user.name}`;

   let emailTd = document.createElement("td");
   emailTd.innerHTML = `${user.email}`;
   emailTd.addEventListener("click" , ()=> window.open(`mailto:${user.email}`));
   emailTd.style.cursor = "pointer";

   let cardTd = document.createElement("td");
   cardTd.innerHTML = `${user.card}`;
   cardTd.addEventListener("click" , () => window.open(`tel:${user.card}`))
   cardTd.style.cursor = "pointer";

   let saveCheck = document.createElement("input");
   saveCheck.setAttribute("type", "checkbox");
   saveCheck.addEventListener("click", (e)=>e.preventDefault());
   saveCheck.checked = user.check;
   saveCheck.setAttribute("style","form-check-input");

   let saveTd = document.createElement("td");
   saveTd.appendChild(saveCheck);

   let editImg = document.createElement("img");
   editImg.setAttribute("src", `Assets/saveIcon.png`);
   editImg.addEventListener("click", editUser);

   let editTd = document.createElement("td");
   editTd.appendChild(editImg);

   let deleteImg = document.createElement("img");
   deleteImg.setAttribute("src", `Assets/deleteIcon.png`);
   deleteImg.addEventListener("click", deletusUser);

   let deleteTd = document.createElement("td");
   deleteTd.appendChild(deleteImg);

   let dataTr = document.createElement("tr");

   dataTr.appendChild(IDTD);
   dataTr.appendChild(nameTd);
   dataTr.appendChild(emailTd);
   dataTr.appendChild(cardTd);
   dataTr.appendChild(saveTd);
   dataTr.appendChild(editTd);
   dataTr.appendChild(deleteTd);

   tableBody.appendChild(dataTr);
}