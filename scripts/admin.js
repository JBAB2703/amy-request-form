document.addEventListener("DOMContentLoaded", () => {
    const clientSelect = document.getElementById("clientSelect");
    const requestTableBody = document.querySelector("#requestTable tbody");
    const inventoryTableBody = document.querySelector("#inventoryTable tbody");
  
    const SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwiDXJl4ddMR3TJuhSnMPS8OLSGf7caX4Br4xg2WiwjbHzrOKLc6bMRxbj_dD1JFjLz/exec";
  
    // Load clients on page load
    fetch(`${SHEET_WEB_APP_URL}?type=clients`)
      .then(res => res.json())
      .then(data => {
        populateClientDropdown(data.clients);
      })
      .catch(err => {
        console.error("Error loading client list:", err);
      });
  
    // Populate the client dropdown
    function populateClientDropdown(clients) {
      clients.forEach(client => {
        const option = document.createElement("option");
        option.value = client.name;
        option.textContent = client.portalName;
        clientSelect.appendChild(option);
      });
    }
  
    // When a client is selected
    clientSelect.addEventListener("change", () => {
      const selectedClient = clientSelect.value;
      if (!selectedClient) return;
  
      fetch(`${SHEET_WEB_APP_URL}?type=requests&client=${encodeURIComponent(selectedClient)}`)
        .then(res => res.json())
        .then(data => {
          renderRequests(data.requests);
          renderInventory(data.inventory); // Optional if you're returning both
        })
        .catch(err => {
          console.error("Error loading client data:", err);
        });
    });
  
    function renderRequests(requests) {
      requestTableBody.innerHTML = "";
      requests.forEach(req => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${req.status}</td>
          <td>${req.timestamp}</td>
          <td>${req.task}</td>
          <td>${req.urgency}</td>
          <td>${req.submittedBy}</td>
        `;
        requestTableBody.appendChild(row);
      });
    }
  
    function renderInventory(items) {
      inventoryTableBody.innerHTML = "";
      items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.room}</td>
          <td>${item.item}</td>
          <td>${item.model}</td>
          <td>${item.notes}</td>
        `;
        inventoryTableBody.appendChild(row);
      });
    }
  });
  