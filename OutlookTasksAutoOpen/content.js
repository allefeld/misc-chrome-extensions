// Opens the Tasks side panel in Outlook.

// version linearized by ChatGPT

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("[OTP] OpenTasksPanel extension.");

window.addEventListener('load', async () => {
  // Wait until the button #Time exists ("My Day")
  console.log("[OTP] Waiting for #Time");
  let bTime;
  while (!(bTime = document.getElementById("Time"))) {
    console.log("[OTP] Still waiting");
    await sleep(500);
  }
  
  // Click the button #Time (so that the tabs "Calendar" and "To Do" appear)
  console.log("[OTP] Found #Time, clicking");
  bTime.click();
  
  // Wait until the button #time-panel-pivot-Tasks exists ("To Do")
  // Continue to click the button #Time while waiting
  console.log("[OTP] Waiting for #time-panel-pivot-Tasks");
  let bTasks;
  while (!(bTasks = document.getElementById("time-panel-pivot-Tasks"))) {
    console.log("[OTP] Still waiting, clicking #Time again");
    bTime.click();
    await sleep(500);
  }
  
  // Click the button #time-panel-pivot-Tasks
  console.log("[OTP] Found #time-panel-pivot-Tasks, clicking");
  bTasks.click();

  console.log("[OTP] OpenTasksPanel extension done.");
});


// Original code

// // When the page finished loading:
// // 1. Wait until the button #Time exists ("My Day")
// // 2. Click the button #Time (so that the tabs "Calendar" and "To Do" appear)
// // 3. Wait until the button #time-panel-pivot-Tasks exists ("To Do")
// //    Continue to click the button #Time while waiting
// // 4. Click the button #time-panel-pivot-Tasks


// console.log("OpenTasksPanel extension.");
// window.onload = (event) => {

//   let iTime;
//   let iTasks;

//   function waitForTime() {
//     console.log("  Still waiting");
//     const bTime = document.getElementById("Time");
//     if (bTime) {
//       clearInterval(iTime);
//       console.log("Found #Time, clicking");
//       bTime.click();

//       function waitForTasks() {
//         console.log("  Still waiting");
//         const bTasks = document.getElementById("time-panel-pivot-Tasks");
//         if (bTasks) {
//           clearInterval(iTasks);
//           console.log("Found #time-panel-pivot-Tasks, clicking");
//           bTasks.click();
//           console.log("OpenTasksPanel extension done.");
//         } else {
//           console.log("Clicking #Time again");
//           bTime.click();
//         }
//       }

//     console.log("Waiting for #time-panel-pivot-Tasks");
//       iTasks = setInterval(waitForTasks, 500);
//     }
//   }

//   console.log("Waiting for #Time");
//   iTime = setInterval(waitForTime, 500);
// };
