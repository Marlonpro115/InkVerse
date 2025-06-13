// Cropper.js desde CDN
let cropper;
let selectedFile;

function openCropperModal(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('cropper-image').src = e.target.result;
    document.getElementById('cropper-modal').style.display = 'flex';
    if (cropper) cropper.destroy();
    cropper = new Cropper(document.getElementById('cropper-image'), {
      aspectRatio: 1, // Puedes cambiar a null para libre
      viewMode: 1,
      autoCropArea: 1,
      responsive: true,
      background: false,
      minContainerWidth: 300,
      minContainerHeight: 300
    });
  };
  reader.readAsDataURL(file);
}

function closeCropperModal() {
  document.getElementById('cropper-modal').style.display = 'none';
  if (cropper) cropper.destroy();
}

function cropAndUpload() {
  if (!cropper) return;
  cropper.getCroppedCanvas({
    width: 400,
    height: 400,
    imageSmoothingQuality: 'high'
  }).toBlob(function(blob) {
    const formData = new FormData();
    formData.append('profile_picture', blob, selectedFile.name);
    fetch('/profile/edit-picture', {
      method: 'POST',
      body: formData
    }).then(() => {
      window.location.reload();
    });
  }, 'image/jpeg', 0.95);
}

document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('editProfileInput');
  if (input) {
    input.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0];
        openCropperModal(selectedFile);
      }
    });
  }
  const cancelBtn = document.getElementById('cropper-cancel-btn');
  if (cancelBtn) cancelBtn.onclick = closeCropperModal;
  const confirmBtn = document.getElementById('cropper-confirm-btn');
  if (confirmBtn) confirmBtn.onclick = cropAndUpload;
});
