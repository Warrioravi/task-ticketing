var uid = new ShortUniqueId();

let colors = ["black", "green", "yellow", "red"];

let deleteBtn = document.querySelector(".delete");

let deletemode = false;

let allFilterDivs=document.querySelectorAll(".filter div");
for( let i=0;i<4;i++){
   allFilterDivs[i].addEventListener("click",(e)=>{
      if(e.currentTarget.classList.contains("filter-selected")){
         e.currentTarget.classList.remove("filter-selected");
         loadTasks();
      }
      else{
         e.currentTarget.classList.add("filter-selected");
         let color=e.currentTarget.classList[0];
         loadTasks(color);
      }
      
   })
}





if (localStorage.getItem("AllTickets") == undefined) {//true if exists false if does
   let allTickets = {};

   allTickets = JSON.stringify(allTickets)

   localStorage.setItem("AllTickets", allTickets);

}
loadTasks()





deleteBtn.addEventListener("click", (e) => {
   if (e.currentTarget.classList.contains("delete-selected")) {
      e.currentTarget.classList.remove("delete-selected");
      deletemode = false;
   }
   else {
      e.currentTarget.classList.add("delete-selected");
      deletemode = true;
   }
})



document.querySelector('.add').addEventListener('click', () => {
   let preModal = document.querySelector('.modal');
   if (preModal != null) {
      return;
   }

   let modal = document.createElement('div');
   modal.innerHTML = `<div class="modal">
   <div class="task-section">
       <div class="task-inner-container" contenteditable="true">

       </div>
   </div>
   <div class="modal-priority-section">
       <div class="priority-inner-container">
           <div class="modal-priority red"></div>
           <div class="modal-priority yellow"></div>
           <div class="modal-priority green"></div>
           <div class="modal-priority black selected"></div>
       </div>
   </div>
</div>`;

   let ticketColor = "black";


   let allModalPriority = modal.querySelectorAll(".modal-priority");

   for (let i = 0; i < allModalPriority.length; i++) {

      allModalPriority[i].addEventListener('click', (e) => {
         for (let j = 0; j < allModalPriority.length; j++) {
            allModalPriority[j].classList.remove("selected");
         }
         e.currentTarget.classList.add("selected");
         ticketColor = e.currentTarget.classList[1];
         // console.log(ticketColor);
      })
   }
   let taskInnerContainer = modal.querySelector('.task-inner-container');
   taskInnerContainer.addEventListener('keydown', function (e) {

      if (e.key == "Enter") {
         // console.log(ticketColor);
         // console.log(e.currentTarget.innerHTML);


         //get data from local storage
         let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
         let id = uid();
         let task = e.currentTarget.innerHTML;
         //update local
         let ticketObj = {
            color: ticketColor,
            taskValue: task
         }
         allTickets[id] = ticketObj;
         //update local storage
         localStorage.setItem("AllTickets", JSON.stringify(allTickets));






         let ticketDiv = document.createElement("div");
         ticketDiv.classList.add("ticket");
         ticketDiv.setAttribute("data-id",id);

         



         ticketDiv.innerHTML = `<div data-id=${id} class="ticket-color ${ticketColor}"></div>
                                <div class="ticket-id">#${id}</div>
                                <div class="actual-task" data-id=${id} contenteditable="true">${task}</div>`;

         

            let actualTaskDiv= ticketDiv.querySelector(".actual-task");
            actualTaskDiv.addEventListener("input",(e)=>{
            let currentTicketId=e.currentTarget.getAttribute("data-id");
            let updatedTask=e.currentTarget.innerText;
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
            //update color in local
            allTickets[currentTicketId].taskValue = updatedTask;;
            //update local storage
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            })
  
            let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click", function (e) {


            let currentTicketId=e.currentTarget.getAttribute("data-id");



            let currColor = e.currentTarget.classList[1];

            let index = colors.indexOf(currColor);

            index = index + 1;
            index = index % 4;


            let newColor = colors[index];

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
            //update color in local
            allTickets[currentTicketId].color = newColor;;
            //update local storage
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));



            ticketColorDiv.classList.replace(currColor, newColor);
            
            })
            ticketDiv.addEventListener("click", (e) => {
               if (deletemode) {
                  let currentTicketId=e.currentTarget.getAttribute("data-id");
                  let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
                  //update  in local
                   delete allTickets[currentTicketId];
                  //update local storage
                  localStorage.setItem("AllTickets", JSON.stringify(allTickets));
   
                  ticketDiv.remove();
               }
            })
       
            document.querySelector('.grid').append(ticketDiv);
        
            modal.remove();
      }
      else if (e.key === "Escape") {
         modal.remove();

      }


   })
   document.querySelector('body').append(modal);
})

 function loadTasks(color){
    
   
   let ticketsOnUi=document.querySelectorAll(".ticket");
   for(let  i=0;i<ticketsOnUi.length;i++){
      ticketsOnUi[i].remove();
   }
   
   
   //fetch all tickets data from local
   let allTickets=JSON.parse(localStorage.getItem("AllTickets"));

   //create ticket ui for each ticket object
    for(x in allTickets){
      let currentTicketId=x;
      let singleTicketObj=allTickets[x];


      if(color&& color!=singleTicketObj.color) continue;
      let ticketDiv = document.createElement("div");
      ticketDiv.classList.add("ticket");
      ticketDiv.setAttribute("data-id",currentTicketId);
      ticketDiv.innerHTML = `<div data-id=${currentTicketId} class="ticket-color ${singleTicketObj["color"]}"></div>
      <div class="ticket-id">#${currentTicketId}</div>
      <div class="actual-task" data-id=${currentTicketId} contenteditable="true">${singleTicketObj["taskValue"]}</div>`;
       
      
      
      let actualTaskDiv = ticketDiv.querySelector(".actual-task");
       actualTaskDiv.addEventListener("input", (e) => {
          let currentTicketId = e.currentTarget.getAttribute("data-id");
          let updatedTask = e.currentTarget.innerText;
          let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
          //update color in local
          allTickets[currentTicketId].taskValue = updatedTask;;
          //update local storage
          localStorage.setItem("AllTickets", JSON.stringify(allTickets));
       })




       let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
       ticketColorDiv.addEventListener("click", function (e) {


          let currentTicketId = e.currentTarget.getAttribute("data-id");



          let currColor = e.currentTarget.classList[1];

          let index = colors.indexOf(currColor);

          index = index + 1;
          index = index % 4;


          let newColor = colors[index];

          let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
          //update color in local
          allTickets[currentTicketId].color = newColor;;
          //update local storage
          localStorage.setItem("AllTickets", JSON.stringify(allTickets));



          ticketColorDiv.classList.replace(currColor, newColor);

       })



       ticketDiv.addEventListener("click", (e) => {
          if (deletemode) {
             let currentTicketId = e.currentTarget.getAttribute("data-id");
             let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
             //update  in local
             delete allTickets[currentTicketId];
             //update local storage
             localStorage.setItem("AllTickets", JSON.stringify(allTickets));

             ticketDiv.remove();
          }
       })

       document.querySelector('.grid').append(ticketDiv);

    }

 }

