const datasetFile = document.getElementById('datasetFile');
const datasetPreview = document.getElementById('datasetPreview');

// Display file name on file selection
datasetFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        datasetPreview.textContent = `Selected file: ${file.name}`;
    }
});

// Prevent page reset when clicking the upload button
document.getElementById('submitDataset').addEventListener('click', (event) => {
    event.preventDefault();  // Prevent default action

    const fileInput = document.getElementById('datasetFile');
    const file = fileInput.files[0];
  
    if (file) {
        const formData = new FormData();
        formData.append('datasetFile', file);
  
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('datasetPreview').textContent = `Uploaded: ${data.file.originalname}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please select a file first.');
    }
});

document.getElementById('showDataset').addEventListener('click', () => {
    fetch('http://localhost:8000/show-dataset')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            const datasetPreview = document.getElementById('datasetPreview');
            datasetPreview.textContent = `Dataset Preview: ${JSON.stringify(data.data, null, 2)}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('showDataset').addEventListener('click', () => {
    fetch('http://localhost:8000/show-dataset')
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Debugging: See what data is coming from Flask
            const tableHead = document.querySelector('#datasetTable thead tr');
            const tableBody = document.querySelector('#datasetTable tbody');

            // Clear previous table data if any
            tableHead.innerHTML = '';
            tableBody.innerHTML = '';

            if (!data || data.length === 0) {
                console.error("Dataset is empty or undefined");
                return;
            }

            // Populate headers
            const headers = Object.keys(data[0]);
            headers.forEach(header => {
                const th = document.createElement('th');
                th.classList.add('px-6', 'py-3', 'text-left', 'bg-blue-600', 'text-white', 'font-medium');
                th.textContent = header;
                tableHead.appendChild(th);
            });

            // Populate rows
            data.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.classList.add('px-6', 'py-4', 'bg-gray-800', 'text-white');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
});
