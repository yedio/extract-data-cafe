document
  .getElementById("jsonFileInput")
  .addEventListener("change", handleFileUpload);
document
  .getElementById("downloadExcel")
  .addEventListener("click", downloadExcel);

let extractedData = []; // 변환된 데이터를 저장할 배열

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const jsonData = JSON.parse(e.target.result);
      extractedData = extractData(jsonData);
      console.log("&&21", jsonData, extractedData);
      alert("데이터 추출 완료! 엑셀 다운로드 버튼을 눌러주세요.");
    } catch (error) {
      alert("올바른 JSON 파일을 업로드하세요.");
    }
  };
  reader.readAsText(file);
}

function extractData(jsonData) {
  const comments = jsonData.result.comments.items || [];

  let extracted = [];
  comments.forEach((comment) => {

    extracted.push({
      닉네임: comment.writer?.nick || "N/A",
      내용: comment.content || "N/A",
    });
  });

  return extracted;
}

function downloadExcel() {
  if (extractedData.length === 0) {
    alert("먼저 JSON 파일을 업로드하세요.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(extractedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ExtractedData");

  XLSX.writeFile(workbook, "extracted_data.xlsx");
}
