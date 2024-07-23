document.addEventListener('DOMContentLoaded', () => {
  const FORM = document.querySelector("#dog-form");
  const DOG_LIST = document.querySelector("#table-body");

  // Event listener for form submission
  FORM.addEventListener('submit', (e) => {
    e.preventDefault();

    // Retrieve form data
    const formData = new FormData(FORM);
    const dogId = formData.get("id");

    // Prepare data for PATCH request
    const updatedDog = {
      name: formData.get("name"),
      breed: formData.get("breed"),
      sex: formData.get("sex"),
    };

    // Make PATCH request to update dog information
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedDog)
    })
    .then(res => res.json())
    .then(updatedDog => {
      console.log("Updated dog successfully:", updatedDog);

      // Clear the form after successful update
      FORM.reset();

      // Refresh the dog list in the table
      renderDogs();
    })
    .catch(error => {
      console.error('Error updating dog:', error);
    });
  });

  // Function to render dogs into the table
  function renderDogs() {
    fetch("http://localhost:3000/dogs")
      .then(res => res.json())
      .then(data => {
        // Clear existing table rows
        DOG_LIST.innerHTML = '';

        // Iterate over the dogs array and create table rows
        data.forEach(dogs => {
          const row = document.createElement('tr');

          // Create table cells for each dog property
          const nameCell = document.createElement('td');
          nameCell.textContent = dogs.name;
          row.appendChild(nameCell);

          const breedCell = document.createElement('td');
          breedCell.textContent = dogs.breed;
          row.appendChild(breedCell);

          const sexCell = document.createElement('td');
          sexCell.textContent = dogs.sex;
          row.appendChild(sexCell);

          // Create Edit button
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit Dog';
          editButton.addEventListener('click', () => {
            checkDogsValueForm(dogs);
          });

          // Create a cell for the Edit button
          const actionCell = document.createElement('td');
          actionCell.appendChild(editButton);
          row.appendChild(actionCell);

          // Append the row to the table body
          DOG_LIST.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching dogs:', error);
      });
  }

  // Function to populate form with dog's current information
  function checkDogsValueForm(dogs) {
    document.getElementById('id').value = dogs.id;
    document.getElementById('name').value = dogs.name;
    document.getElementById('breed').value = dogs.breed;
    document.getElementById('sex').value = dogs.sex;
  }

  // Initial render of dogs when the page loads
  renderDogs();
});
