const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("jsonFileInput");
const fileListContainer = document.getElementById("fileList");
const extractButton = document.getElementById("extractData");
const downloadButton = document.getElementById("downloadExcel");
const resetButton = document.getElementById("resetUpload");

let extractedData = [];
let fileOrder = [];

// 📌 드래그 앤 드롭 기능 추가
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("active");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("active")
);
dropZone.addEventListener("drop", handleDrop);
dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => handleFileUpload(e.target.files));

extractButton.addEventListener("click", extractDataFromFiles);
downloadButton.addEventListener("click", downloadExcel);
resetButton.addEventListener("click", resetUpload);

function updateUI() {
  dropZone.classList.add("hidden");
  fileListContainer.classList.remove("hidden");
  extractButton.classList.remove("hidden");
  resetButton.classList.remove("hidden");

  fileListContainer.innerHTML = fileOrder
    .map((file, index) => `<p>${index + 1}. ${file.name}</p>`)
    .join("");
}

function handleFileUpload(files) {
  if (files.length === 0) return;

  fileOrder = Array.from(files);
  extractedData = []; // 기존 데이터 초기화

  updateUI();
}

function handleDrop(event) {
  event.preventDefault();
  dropZone.classList.remove("active");
  handleFileUpload(event.dataTransfer.files);
}

function extractDataFromFiles() {
  if (fileOrder.length === 0) {
    alert("먼저 JSON 파일을 업로드하세요.");
    return;
  }

  extractedData = [];
  let filesProcessed = 0;

  fileOrder.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target.result);
        extractedData.push(...extractData(jsonData));
      } catch (error) {
        alert("올바른 JSON 파일을 업로드하세요.");
      } finally {
        filesProcessed++;
        if (filesProcessed === fileOrder.length) {
          alert(
            `데이터 추출 완료! 총 ${extractedData.length}개의 항목이 있습니다.`
          );
          downloadButton.classList.remove("hidden");
          extractButton.classList.add("hidden");
        }
      }
    };
    reader.readAsText(file);
  });
}

// 📌 JSON 데이터에서 닉네임과 내용만 추출
function extractData(jsonData) {
  const comments = jsonData?.result?.comments?.items || [];
  return comments.map((comment) => [
    comment.writer?.nick || "N/A",
    comment.content || "N/A",
  ]);
}

function downloadExcel() {
  if (extractedData.length === 0) {
    alert("먼저 데이터를 추출하세요.");
    return;
  }

  const worksheet = XLSX.utils.aoa_to_sheet(extractedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ExtractedData");

  XLSX.writeFile(workbook, "extracted_data.xlsx");
}

function resetUpload() {
  extractedData = [];
  fileOrder = [];
  fileInput.value = "";

  dropZone.classList.remove("hidden");
  fileListContainer.classList.add("hidden");
  extractButton.classList.add("hidden");
  downloadButton.classList.add("hidden");
  resetButton.classList.add("hidden");

  fileListContainer.innerHTML = "";
}
