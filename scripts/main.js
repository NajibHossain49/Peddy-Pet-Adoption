// Main Function, Fetch of All Pets on Page Load
const fetchAllPets = async () => {
  showSpinner();
  const response = await fetch(
    "https://openapi.programming-hero.com/api/peddy/pets"
  );
  const data = await response.json();

  setTimeout(() => {
    hideSpinner();
    if (data.status) {
      allPets = data.pets; // Store all pets globally
      displayPets(data.pets);
    }
  }, 2000);
};

// Display Pets and Display filtered pets based on category
const displayPets = (pets) => {
  const petsContainer = document.getElementById("pets-container");
  petsContainer.innerHTML = "";

  const gridContainer = document.createElement("div");
  gridContainer.classList.add(
    "grid",
    "grid-cols-1",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "gap-4"
  );

  pets.forEach((pet) => {
    const petCard = document.createElement("div");
    petCard.classList.add(
      "bg-white",
      "shadow-lg",
      "rounded-lg",
      "overflow-hidden",
      "p-4",
      "text-left",
      "transition",
      "hover:shadow-xl",
      "border-2"
    );

    petCard.innerHTML = `
        <img src="${pet.image}" alt="${
      pet.pet_name
    }" class="w-full h-48 object-cover rounded-lg mb-4 border-4">
        <h2 class="text-2xl font-bold mb-2">${pet.pet_name}</h2>
        
        <div class="flex items-center mb-2">
            <i class="ri-bar-chart-box-line"></i> 
            <p class="text-gray-600 px-2"><strong>Breed:</strong> ${
              pet.breed || "N/A"
            }</p>
        </div>
        
        <div class="flex items-center mb-2">
            <i class="ri-calendar-line"></i> 
            <p class="text-gray-600 px-2"><strong>Birth:</strong> ${
              pet.date_of_birth || "N/A"
            }</p>
        </div>
        
        <div class="flex items-center mb-2">
            <i class="ri-women-line"></i> 
            <p class="text-gray-600 px-2"><strong>Gender:</strong> ${
              pet.gender || "N/A"
            }</p>
        </div>
        
        <div class="flex items-center mb-4">
            <i class="ri-price-tag-2-line"></i> 
            <p class="text-gray-800 font-bold px-2"><strong>Price:</strong> $${
              pet.price || "N/A"
            }</p>
        </div>
        
        <div class="mt-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-md md:max-w-lg lg:max-w-3xl mx-auto">
          <button class="bg-white border-2 border-gray-200 font-normal text-black text-sm md:text-base lg:text-lg px-6 md:px-8 py-2 md:py-3 rounded-lg transition hover:bg-[#0E7A81] hover:text-white like-btn">
          <i class="ri-thumb-up-line"></i>
          </button>
          <button class="bg-white border-2 border-gray-200 font-semibold text-[#0E7A81] text-sm md:text-base lg:text-lg px-4 md:px-6 py-2 md:py-3 rounded-lg transition hover:bg-[#0E7A81] hover:text-white adopt-btn">
          Adopt
          </button>

          <button class="bg-white border-2 border-gray-200 font-semibold text-[#0E7A81] text-sm md:text-base lg:text-lg px-4 md:px-6 py-2 md:py-3 rounded-lg transition hover:bg-[#0E7A81] hover:text-white details-btn" data-pet-id="${
            pet.petId
          }">Details </button>
        </div>

      `;

    // Add click event listener to the adopt button
    petCard.querySelector(".adopt-btn").addEventListener("click", (e) => {
      // Start the countdown on click
      showCountdownModal(e.target);
    });

    // Add click event listener to the like button
    petCard.querySelector(".like-btn").addEventListener("click", () => {
      addLikedPetImage(pet.image);
    });

    // Add click event listener for the details button
    petCard.querySelector(".details-btn").addEventListener("click", () => {
      fetchPetDetailsById(pet.petId);
    });

    gridContainer.appendChild(petCard);
  });

  petsContainer.appendChild(gridContainer);
};

// Fetch Categories and Create Buttons
const fetchCategories = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/peddy/categories"
  );

  const data = await response.json();
  const categories = data.categories;
  const categoryButtonsDiv = document.getElementById("category-buttons");

  categories.forEach((category) => {
    // Create button elements
    const button = document.createElement("button");
    button.classList.add(
      "bg-gray-200",
      "text-black",
      "font-bold",
      "py-2",
      "px-4",
      "rounded-3xl",
      "w-4/4",
      "sm:w-auto",
      "flex",
      "justify-center",
      "items-center",
      "space-x-2",
      "text-sm",
      "sm:text-base",
      "sm:py-3",
      "sm:px-6"
    );
    const icon = document.createElement("img");
    icon.src = category.category_icon;
    icon.alt = `${category.category} icon`;
    icon.classList.add("w-6", "h-6");

    const span = document.createElement("span");
    span.innerText = category.category;

    button.appendChild(icon);
    button.appendChild(span);

    // Add event listener to fetch pets based on category click
    button.addEventListener("click", () => {
      // Set active button style
      setActiveButton(button);
      fetchPetsByCategory(category.category);
    });

    categoryButtonsDiv.appendChild(button);
  });
};

// Spinner Handling
const showSpinner = () => {
  const spinner = document.getElementById("spinner");
  // Show the spinner
  spinner.style.display = "flex";
};

const hideSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "none";
};

// Set Active Button
const setActiveButton = (activeButton) => {
  const buttons = document.querySelectorAll("#category-buttons button");
  buttons.forEach((button) => {
    button.classList.remove("bg-green-200", "text-black");
  });

  activeButton.classList.add("bg-green-200", "text-black");
};

// To store the pets of the selected category
let currentCategoryPets = [];

// To track if a category is selected
let isCategorySelected = false;

// To store all pets
let allPets = [];

// Fetch Pets Based on Category Button
const fetchPetsByCategory = async (category) => {
  showSpinner();
  const response = await fetch(
    "https://openapi.programming-hero.com/api/peddy/pets"
  );
  const data = await response.json();

  setTimeout(() => {
    hideSpinner();
    if (data.status) {
      const filteredPets = data.pets.filter(
        (pet) => pet.category.toLowerCase() === category.toLowerCase()
      );

      if (filteredPets.length === 0 && category.toLowerCase() === "bird") {
        displayNoBirdInfo();
      } else {
        currentCategoryPets = filteredPets; // Store filtered pets
        isCategorySelected = true; // Mark that a category is selected
        displayPets(filteredPets);
      }
    }
  }, 2000);
};

// Function to display message when no bird information is available
const displayNoBirdInfo = () => {
  const petsContainer = document.getElementById("pets-container");
  petsContainer.innerHTML = "";

  const noBirdCard = document.createElement("div");
  noBirdCard.classList.add(
    "bg-white",
    "shadow-lg",
    "rounded-lg",
    "overflow-hidden",
    "p-4",
    "text-center",
    "transition",
    "hover:shadow-xl"
  );

  noBirdCard.innerHTML = `
      <div class="flex flex-col items-center">
          <img src="images/error.webp" alt="No Information Available" class="w-64 h-64 object-contain rounded-lg mb-6">
          <h2 class="text-xl font-semibold mb-4 text-center">No Information Available</h2>
          <p class="text-gray-600 mb-4 text-center max-w-md">
              We apologize, but no information is available at this time. Please feel free to reach out for further inquiries.
          </p>
      </div>
  `;

  petsContainer.appendChild(noBirdCard);
};

// Fetch Pet Details by ID
const fetchPetDetailsById = async (petId) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
  );
  const data = await response.json();

  if (data.status) {
    displayPetDetailsModal(data.petData);
  } else {
    console.error("Failed to fetch pet details");
  }
};

// Display Pet Details in Modal
const displayPetDetailsModal = (petData) => {
  const modal = document.getElementById("pet-details-modal");
  const modalContent = document.getElementById("modal-content");

  modalContent.innerHTML = `
      <div class="flex flex-col items-start p-4 sm:p-6 max-w-md sm:max-w-lg w-full mx-auto">
    <!-- Image at the top - visible on all devices, but smaller on small screens -->
    <img src="${petData.image || "default-image.jpg"}" alt="${
    petData.pet_name || "N/A"
  }"
        class="w-full h-auto max-h-40 sm:max-h-64 md:max-h-96 object-cover rounded-lg mb-4">

    <!-- Pet name - visible on all devices, with different sizes for different screens -->
    <h2 class="text-lg sm:text-xl md:text-2xl font-semibold mb-4">${
      petData.pet_name || "N/A"
    }</h2>

    <!-- Two-column layout for pet info - stacked on small devices, side-by-side on medium and up -->
    <div class="grid grid-cols-1 gap-y-4 md:grid-cols-2 gap-x-6 mb-4">
        <!-- Left column -->
        <div>
            <p><i class="ri-bar-chart-box-line"></i> <strong>Breed:</strong> ${
              petData.breed || "N/A"
            }</p>
            
            <p><i class="ri-women-line"></i> <strong>Gender:</strong> ${
              petData.gender || "N/A"
            }</p>

            <p><i class="ri-women-line"></i> <strong>Vaccinated Status:</strong> ${
              petData.vaccinated_status || "N/A"
            }</p>

        </div>
        <!-- Right column -->
        <div>
            

<p><i class="ri-calendar-line"></i> <strong>Birth:</strong> ${
    petData.date_of_birth || "N/A"
  }</p>

            <p><i class="ri-price-tag-2-line"></i> <strong>Price:</strong> $${
              petData.price || "N/A"
            }</p>
            
        </div>
    </div>

    <!-- Horizontal details below - visible on all devices -->
    <p class="w-full text-sm sm:text-base"><strong>Details:</strong> ${
      petData.pet_details || "N/A"
    }</p>

    <!-- Centered and wider Close button - visible on all devices -->
    <button class="bg-[#a9e7ec90] text-[#0E7A81] font-semibold px-4 sm:px-6 py-3 mt-6 rounded-lg w-full sm:w-2/3 md:w-1/2 mx-auto close-modal-btn">
        Close
    </button>
</div>

`;

  // Show the modal
  modal.style.display = "flex";

  const closeModalBtn = document.querySelector(".close-modal-btn");
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
};

// Function to close the modal
const closeModal = () => {
  const modal = document.getElementById("pet-details-modal");
  modal.style.display = "none";
};

// Function to display liked pet images in the right side container
const addLikedPetImage = (imageUrl) => {
  const likedPetsContainer = document.getElementById("liked-pets-container");

  const likedPetImage = document.createElement("div");

  likedPetImage.innerHTML = `
      <img src="${imageUrl}" alt="Liked Pet" class="w-full h-24 object-cover rounded-lg shadow-md">
    `;
  likedPetsContainer.appendChild(likedPetImage);
};

// Function to display liked pet images in the right side container
const displayLikedPet = (pet) => {
  const likedPetContainer = document.getElementById("liked-pet-container");
  likedPetContainer.innerHTML = "";

  const likedPetCard = document.createElement("div");
  likedPetCard.classList.add(
    "bg-white",
    "shadow-md",
    "rounded-lg",
    "overflow-hidden",
    "p-4",
    "text-center"
  );

  likedPetCard.innerHTML = `
        <img src="${pet.image}" alt="${
    pet.pet_name
  }" class="w-full h-48 object-cover rounded-lg mb-4">
        <h2 class="text-lg font-semibold mb-2">${pet.pet_name}</h2>
        <p class="text-gray-600 mb-4"><strong>Breed:</strong> ${
          pet.breed || "N/A"
        }</p>
      `;

  likedPetContainer.appendChild(likedPetCard);
};

// Function to show the countdown modal and update the button text
const showCountdownModal = (adoptButton) => {
  const countdownModal = document.getElementById("countdown-modal");
  const countdownNumber = document.getElementById("countdown-number");

  let countdown = 3;
  // Set the initial countdown number
  countdownNumber.innerText = countdown;
  // Show the modal
  countdownModal.style.display = "flex";

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownNumber.innerText = countdown;

    if (countdown === 0) {
      // Stop the countdown
      clearInterval(countdownInterval);
      countdownModal.style.display = "none";
      // Change the button text to "Adopted"
      adoptButton.innerText = "Owned";
      // Disable the button after adoption
      adoptButton.disabled = true;
      adoptButton.classList.add("bg-gray-400", "cursor-not-allowed");
    }
  }, 1000);
};

// Function to sort pets by price in descending order
const sortPetsByPrice = () => {
  let petsToSort;

  if (isCategorySelected) {
    // Sort the pets of the selected category
    petsToSort = [...currentCategoryPets];
  } else {
    // Sort all pets if no category is selected
    petsToSort = [...allPets];
  }

  // Sort the pets by price in descending order
  const sortedPets = petsToSort.sort((a, b) => (b.price || 0) - (a.price || 0));

  // Display the sorted pets
  displayPets(sortedPets);
};

// Add event listener to the "Sort by Price" button
document.getElementById("sort-btn").addEventListener("click", () => {
  sortPetsByPrice();
});

// Main 1st Entry Point, Initial Fetch of All Pets on Page Load
fetchAllPets();

// Main 2st Entry Point, Fetch Categories and Setup Buttons
fetchCategories();
