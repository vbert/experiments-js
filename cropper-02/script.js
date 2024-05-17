let cropper;

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById('image');
      img.src = e.target.result;

      // Display the crop container
      document.getElementById('cropContainer').style.display = 'block';

      // Initialize Cropper.js
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
        responsive: true,
        scalable: true,
      });
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('cropButton').addEventListener('click', function() {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas();
    const croppedCanvas = document.getElementById('croppedCanvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    // Adjust canvas size to match the cropped image
    croppedCanvas.width = canvas.width;
    croppedCanvas.height = canvas.height;
    croppedCtx.drawImage(canvas, 0, 0);
  }
});

document.getElementById('uploadButton').addEventListener('click', function() {
  const croppedCanvas = document.getElementById('croppedCanvas');
  croppedCanvas.toBlob(function(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'cropped_image.png');

    // Replace with your server upload URL
    const uploadUrl = 'upload/'; // 'YOUR_UPLOAD_URL_HERE';
    fetch(uploadUrl, {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
        alert('Upload successful!');
      } else {
        alert('Upload failed.');
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('Upload error.');
    });
  });
});
