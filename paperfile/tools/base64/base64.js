var selectedFile;  // 用于存储选择的文件
var encodeDecodeResult;  // 用于存储编码或解码的结果

function handleFileSelect(files) {
  if (files.length > 0) {
    selectedFile = files[0];
    displaySelectedFileName(selectedFile.name);
  }
}

function dropHandler(event) {
  event.preventDefault();
  handleFileSelect(event.dataTransfer.files);
}

function dragOverHandler(event) {
  event.preventDefault();
}

// 编码文本
function encodeText() {
  var inputText = document.getElementById("inputText").value;
  if (inputText) {
    var outputText = encodeUnicode(inputText);
    displayOutputText(outputText);
    displayResult("编码成功！");
  } else {
    displayResult("请输入文本！");
  }
}

// 辅助encodeText函数，让它使用UTF-8
function encodeUnicode(str) {
  // 将字符串转换为UTF-8，然后进行base64编码
  var utf8Bytes = new TextEncoder().encode(str);
  return btoa(String.fromCharCode.apply(null, utf8Bytes));
}

// 解码文本
function decodeText() {
  var inputText = document.getElementById("inputText").value;
  if (inputText) {
    try {
      var outputText = decodeUnicode(inputText); // 使用 decodeUnicode 替换 atob
      displayOutputText(outputText);
      displayResult("解码成功！");
    } catch (e) {
      displayResult("解码失败：" + e.message);
    }
  } else {
    displayResult("请输入文本！");
  }
}

// 辅助decodeText函数，使用UTF-8
function decodeUnicode(str) {
  // 对base64编码的字符串进行解码，然后转换为UTF-8字符串
  var bytes = atob(str).split('').map(function (char) {
    return char.charCodeAt(0);
  });
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// 重置
function resetFields() {
  document.getElementById("inputText").value = "";
  document.getElementById("outputText").value = "";
  selectedFile = null;
  displaySelectedFileName("");
  displayResult("");
  encodeDecodeResult = null;
}

// 拷贝
function copyResult() {
  var outputText = document.getElementById("outputText");
  if (outputText.value) {
    outputText.select();
    document.execCommand("copy");
    displayResult("已复制到剪贴板！");
  } else {
    displayResult("没有可复制的内容！");
  }
}

// 编码文件
function encodeFile() {
  if (selectedFile) {
    var reader = new FileReader();
    reader.onload = function (event) {
      handleFileEncoding(event.target.result);
    };
    reader.readAsDataURL(selectedFile);
  } else {
    displayResult("请先选择文件！");
  }
}

// 辅助encodeFile函数
function handleFileEncoding(dataURL) {
  var sizeInBytes = calculateSizeInBytes(dataURL);
  var sizeInMB = sizeInBytes / (1024 * 1024);

  if (sizeInMB > 1) {
    displayResult('编码结果较大，请点击"下载结果"来保存');
  } else {
    displayOutputText(dataURL);
    displayResult('编码完成，请点击"复制"或"下载结果"进行保存');
  }

  encodeDecodeResult = dataURL;
}

function calculateSizeInBytes(dataURL) {
  return (dataURL.length * (3 / 4)) - (dataURL.endsWith("==") ? 2 : dataURL.endsWith("=") ? 1 : 0);
}

// 解码文件
function decodeFile() {
  // 检查是否有选择的文件
  if (selectedFile) {
    var reader = new FileReader();
    reader.onload = function (event) {
      try {
        handleFileDecoding(event.target.result);
      } catch (e) {
        displayResult("文件解码失败！错误信息: " + e.message);
      }
    };
    reader.readAsText(selectedFile);
  } else {
    // 如果没有选择的文件，尝试从输入框读取dataURL
    var inputText = document.getElementById("inputText").value;
    if (inputText) {
      try {
        handleFileDecoding(inputText);
      } catch (e) {
        displayResult("解码失败！错误信息: " + e.message);
      }
    } else {
      displayResult("请先选择文件或输入dataURL！");
    }
  }
}

// 辅助decodeFile
function handleFileDecoding(fileContent) {
  if (isDataURL(fileContent)) {
    var base64EncodedData = fileContent.split(',')[1];
    var mimeType = fileContent.split(',')[0].split(':')[1].split(';')[0];
    var byteArray = convertToByteArray(atob(base64EncodedData));
    encodeDecodeResult = new Blob([byteArray], { type: mimeType });
    displayResult("解码成功！请点击下载结果来保存");
  } else {
    displayResult("提供的内容不是有效的dataURL！");
  }
}

function isDataURL(str) {
  return str.startsWith('data:');
}

function convertToByteArray(decodedData) {
  var byteNumbers = new Array(decodedData.length);
  for (var i = 0; i < decodedData.length; i++) {
    byteNumbers[i] = decodedData.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
}

function downloadResult() {
  if (encodeDecodeResult) {
    var blob = createBlobForDownload();
    initiateDownload(blob);
  } else {
    displayResult("没有可下载的内容！");
  }
}

function createBlobForDownload() {
  return encodeDecodeResult instanceof Blob ? encodeDecodeResult : new Blob([encodeDecodeResult], { type: "text/plain" });
}

function initiateDownload(blob) {
  var link = document.createElement("a");
  link.download = determineDownloadFileName(blob);
  link.href = URL.createObjectURL(blob);
  link.click();
  encodeDecodeResult = null;
}

function determineDownloadFileName(blob) {
  var fileName = "result";
  if (blob.type.startsWith("image/")) {
    fileName += "." + blob.type.split('/')[1];
  } else if (blob.type === "text/plain") {
    fileName += ".txt";
  }
  return fileName;
}

function displaySelectedFileName(fileName) {
  document.getElementById("selectedFile").innerHTML = fileName ? "已选择文件：" + fileName : "";
}

function displayOutputText(text) {
  document.getElementById("outputText").value = text;
}

function displayResult(message) {
  document.getElementById("result").innerHTML = message;
}
