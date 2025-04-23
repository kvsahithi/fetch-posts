// Simulates a delayed callback using setTimeout
function delayedCallback(displaymsg) {
  setTimeout(displaymsg, 5000); // It will call the provided function after 5 seconds
}

// Selects common elements used across different methods
let mainWrapper = document.querySelector(".main-wrapper");
let container = document.querySelector(".container");

// Callback-based approach to simulate a delay and then fetch posts
function executeCallback() {
  let output = document.getElementById("output");

  // Adjust layout styling to show the container
  mainWrapper.style.justifyContent = "flex-start";
  container.style.display = "block";

  // Inform user of the simulated delay
  output.innerHTML = "<p>Result will be available in 5 seconds...</p>";

  // After 5 seconds, fetch post data from API and display
  delayedCallback(function () {
    fetch("https://dummyjson.com/posts")
      .then((response) => response.json())
      .then((data) => {
        let posts = data.posts;
        output.innerHTML = "";

        // Create list of post titles
        let ul = document.createElement("ul");
        ul.classList.add("post-list");
        posts.forEach((post) => {
          let li = document.createElement("li");
          li.innerText = post.title;
          li.classList.add("post-item");
          ul.appendChild(li);
        });
        output.appendChild(ul);
      })
      .catch((error) => {
        // Handle fetch errors
        output.innerHTML = "<p class='error'>Error fetching data</p>";
        console.error("Fetch error:", error);
      });
  });
}

// Promise-based approach to fetch posts with a 5-second timeout
function fetchDataWithPromise() {
  let output = document.getElementById("result");

  // Adjust layout and show loading message
  mainWrapper.style.justifyContent = "flex-start";
  container.style.display = "block";
  output.innerHTML = "<p>Loading...</p>";

  // Create a custom Promise to handle timeout logic
  let fetchPromise = new Promise((resolve, reject) => {
    // Set a timeout to reject the promise after 5 seconds
    let timeout = setTimeout(() => {
      reject("Operation timed out.");
    }, 5000);

    // Start fetching the post data
    fetch("https://dummyjson.com/posts")
      .then((response) => {
        clearTimeout(timeout); // Clear timeout if response is received
        return response.json();
      })
      .then((data) => {
        resolve(data.posts); // Resolve the promise with post data
      })
      .catch((error) => reject("error fetching data!"));
  });

  // Handle the result or error from the Promise
  fetchPromise
    .then((data) => {
      output.innerHTML = "";
      let ul = document.createElement("ul");
      ul.classList.add("post-list");
      data.forEach((post) => {
        let li = document.createElement("li");
        li.classList.add("post-item");
        li.textContent = post.title;
        ul.appendChild(li);
      });
      output.appendChild(ul);
    })
    .catch((error) => {
      output.innerHTML = `<p class = 'error'>${error}</p>`;
      console.log("fetch error", error);
    });
}

// Async/Await-based approach to fetch data with timeout and error handling
async function fetchDataWithAsync() {
  let output = document.getElementById("outputByAsync");
  let mainWrapper = document.querySelector(".main-wrapper");
  let container = document.querySelector(".container");

  // Update layout and show loading message
  mainWrapper.style.justifyContent = "flex-start";
  container.style.display = "block";
  output.innerHTML = "<p>Loading...</p>";
  try {
    // Set up abort controller to implement timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort(); // Cancel the fetch request after 5 seconds
    }, 5000);

    // Fetch data with the controller's signal
    let response = await fetch("https://dummyjson.com/posts", {
      signal: controller.signal,
    });
    clearTimeout(timeout); // Clear timeout if fetch completes in time
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    let data = await response.json();

    // Display fetched posts
    displayPosts(data.posts);
  } catch (error) {
    // Display error message if any exception occurs
    output.innerHTML = `<p class = 'error'>${error}</p>`;
    console.log("fetch error", error);
  }
}

// Helper function to display posts in a list
function displayPosts(data) {
  let output = document.getElementById("outputByAsync");
  output.innerHTML = "";

  let ul = document.createElement("ul");
  ul.classList.add("post-list");
  data.forEach((post) => {
    let li = document.createElement("li");
    li.classList.add("post-item");
    li.textContent = post.title;
    ul.appendChild(li);
  });
  output.appendChild(ul);
}
